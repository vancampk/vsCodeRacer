export const RUST_BLOCKS = [
  `use actix_web::{web, App, HttpServer, HttpResponse, Result, middleware::Logger};
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, Pool, Postgres};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
struct User {
    id: i64,
    name: String,
    email: String,
    created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Deserialize)]
struct CreateUserRequest {
    name: String,
    email: String,
}

#[derive(Debug, Serialize)]
struct ApiResponse<T> {
    success: bool,
    data: Option<T>,
    error: Option<String>,
}

async fn create_user(
    pool: web::Data<PgPool>,
    user_data: web::Json<CreateUserRequest>,
) -> Result<HttpResponse> {
    let result = sqlx::query_as!(
        User,
        r#"
        INSERT INTO users (name, email, created_at)
        VALUES ($1, $2, NOW())
        RETURNING id, name, email, created_at
        "#,
        user_data.name,
        user_data.email
    )
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(user) => Ok(HttpResponse::Created().json(ApiResponse {
            success: true,
            data: Some(user),
            error: None,
        })),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            Ok(HttpResponse::InternalServerError().json(ApiResponse::<()> {
                success: false,
                data: None,
                error: Some("Failed to create user".to_string()),
            }))
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    
    let pool = PgPool::connect(&database_url)
        .await
        .expect("Failed to connect to database");
    
    println!("Starting server at http://localhost:8080");
    
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .wrap(Logger::default())
            .route("/users", web::post().to(create_user))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}`,

  `use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tokio::sync::mpsc;
use tokio::time::{sleep, Duration};

#[derive(Debug, Clone)]
pub struct Task {
    pub id: String,
    pub payload: String,
    pub retries: u32,
    pub max_retries: u32,
}

#[derive(Debug)]
pub enum TaskResult {
    Success(String),
    Failure(String),
    Retry,
}

pub trait TaskProcessor: Send + Sync {
    async fn process(&self, task: &Task) -> TaskResult;
}

pub struct WorkerPool<P: TaskProcessor> {
    workers: Vec<Worker<P>>,
    task_sender: mpsc::UnboundedSender<Task>,
}

struct Worker<P: TaskProcessor> {
    id: usize,
    processor: Arc<P>,
    task_receiver: Arc<Mutex<mpsc::UnboundedReceiver<Task>>>,
}

impl<P: TaskProcessor + 'static> WorkerPool<P> {
    pub fn new(worker_count: usize, processor: P) -> Self {
        let (task_sender, task_receiver) = mpsc::unbounded_channel();
        let task_receiver = Arc::new(Mutex::new(task_receiver));
        let processor = Arc::new(processor);

        let mut workers = Vec::with_capacity(worker_count);
        for id in 0..worker_count {
            workers.push(Worker {
                id,
                processor: processor.clone(),
                task_receiver: task_receiver.clone(),
            });
        }

        WorkerPool {
            workers,
            task_sender,
        }
    }

    pub async fn start(&mut self) {
        for worker in &self.workers {
            let worker_id = worker.id;
            let processor = worker.processor.clone();
            let task_receiver = worker.task_receiver.clone();

            tokio::spawn(async move {
                loop {
                    let task = {
                        let mut receiver = task_receiver.lock().unwrap();
                        receiver.recv().await
                    };

                    match task {
                        Some(task) => {
                            println!("Worker {} processing task: {}", worker_id, task.id);
                            
                            let result = processor.process(&task).await;
                            
                            match result {
                                TaskResult::Success(output) => {
                                    println!("Worker {} completed task {}: {}", worker_id, task.id, output);
                                }
                                TaskResult::Failure(error) => {
                                    eprintln!("Worker {} failed task {}: {}", worker_id, task.id, error);
                                }
                                TaskResult::Retry => {
                                    if task.retries < task.max_retries {
                                        let mut retry_task = task.clone();
                                        retry_task.retries += 1;
                                        
                                        let delay = Duration::from_secs(2u64.pow(retry_task.retries));
                                        sleep(delay).await;
                                        
                                        println!("Worker {} retrying task {} (attempt {})", 
                                               worker_id, retry_task.id, retry_task.retries + 1);
                                    } else {
                                        eprintln!("Worker {} exhausted retries for task {}", worker_id, task.id);
                                    }
                                }
                            }
                        }
                        None => {
                            println!("Worker {} shutting down", worker_id);
                            break;
                        }
                    }
                }
            });
        }

        println!("Started {} workers", self.workers.len());
    }

    pub fn submit_task(&self, task: Task) -> Result<(), mpsc::error::SendError<Task>> {
        self.task_sender.send(task)
    }
}

struct EmailProcessor;

#[async_trait::async_trait]
impl TaskProcessor for EmailProcessor {
    async fn process(&self, task: &Task) -> TaskResult {
        sleep(Duration::from_millis(100)).await;
        
        if task.payload.contains("fail") {
            return TaskResult::Failure("Email sending failed".to_string());
        }
        
        if task.payload.contains("retry") && task.retries < 2 {
            return TaskResult::Retry;
        }
        
        TaskResult::Success(format!("Email sent: {}", task.payload))
    }
}

#[tokio::main]
async fn main() {
    let processor = EmailProcessor;
    let mut pool = WorkerPool::new(4, processor);
    
    pool.start().await;
    
    for i in 0..10 {
        let task = Task {
            id: format!("task_{}", i),
            payload: format!("Email content {}", i),
            retries: 0,
            max_retries: 3,
        };
        
        if let Err(e) = pool.submit_task(task) {
            eprintln!("Failed to submit task: {}", e);
        }
    }
    
    sleep(Duration::from_secs(5)).await;
}`,
];