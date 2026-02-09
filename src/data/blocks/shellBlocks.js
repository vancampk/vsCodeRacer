export const SHELL_BLOCKS = [
  `#!/bin/bash

LOG_FILE="/var/log/system_monitor.log"
EMAIL_ALERT="admin@example.com"
CPU_THRESHOLD=80
MEMORY_THRESHOLD=85
DISK_THRESHOLD=90

log_message() {
    echo "\$(date '+%Y-%m-%d %H:%M:%S') - \$1" | tee -a "\$LOG_FILE"
}

send_alert() {
    local subject="\$1"
    local message="\$2"
    
    echo "\$message" | mail -s "\$subject" "\$EMAIL_ALERT"
    log_message "Alert sent: \$subject"
}

check_cpu() {
    local cpu_usage=\$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%* id.*/\\1/" | awk '{print 100 - \$1}')
    cpu_usage=\${cpu_usage%.*}
    
    log_message "CPU Usage: \${cpu_usage}%"
    
    if [ "\$cpu_usage" -gt "\$CPU_THRESHOLD" ]; then
        send_alert "High CPU Usage Alert" "CPU usage is at \${cpu_usage}%, which exceeds the threshold of \${CPU_THRESHOLD}%"
        return 1
    fi
    return 0
}

check_memory() {
    local memory_info=\$(free | grep '^Mem')
    local total_mem=\$(echo \$memory_info | awk '{print \$2}')
    local used_mem=\$(echo \$memory_info | awk '{print \$3}')
    local memory_usage=\$((used_mem * 100 / total_mem))
    
    log_message "Memory Usage: \${memory_usage}%"
    
    if [ "\$memory_usage" -gt "\$MEMORY_THRESHOLD" ]; then
        send_alert "High Memory Usage Alert" "Memory usage is at \${memory_usage}%, which exceeds the threshold of \${MEMORY_THRESHOLD}%"
        return 1
    fi
    return 0
}

check_disk() {
    local disk_usage=\$(df -h / | awk 'NR==2 {print \$5}' | sed 's/%//')
    
    log_message "Disk Usage: \${disk_usage}%"
    
    if [ "\$disk_usage" -gt "\$DISK_THRESHOLD" ]; then
        send_alert "High Disk Usage Alert" "Disk usage is at \${disk_usage}%, which exceeds the threshold of \${DISK_THRESHOLD}%"
        return 1
    fi
    return 0
}

check_load() {
    local load_1min=\$(uptime | awk -F'load average:' '{ print \$2 }' | cut -d, -f1 | sed 's/ //')
    local cpu_cores=\$(nproc)
    local load_percentage=\$(echo "scale=2; \$load_1min * 100 / \$cpu_cores" | bc)
    
    log_message "System Load: \$load_1min (\${load_percentage}% of capacity)"
    
    if (( \$(echo "\$load_percentage > 80" | bc -l) )); then
        send_alert "High System Load Alert" "System load is \$load_1min (\${load_percentage}% of capacity)"
        return 1
    fi
    return 0
}

check_services() {
    local services=("nginx" "mysql" "redis-server" "postgresql")
    local failed_services=()
    
    for service in "\${services[@]}"; do
        if ! systemctl is-active --quiet "\$service"; then
            failed_services+=("\$service")
            log_message "Service \$service is not running"
        else
            log_message "Service \$service is running"
        fi
    done
    
    if [ \${#failed_services[@]} -gt 0 ]; then
        local message="The following services are not running: \${failed_services[*]}"
        send_alert "Service Alert" "\$message"
        return 1
    fi
    return 0
}

main() {
    log_message "Starting system health check"
    
    local issues=0
    
    check_cpu || ((issues++))
    check_memory || ((issues++))
    check_disk || ((issues++))
    check_load || ((issues++))
    check_services || ((issues++))
    
    if [ \$issues -eq 0 ]; then
        log_message "All system checks passed"
    else
        log_message "System health check completed with \$issues issues"
    fi
    
    if [ -f "\$LOG_FILE" ]; then
        tail -n 1000 "\$LOG_FILE" > "\$LOG_FILE.tmp" && mv "\$LOG_FILE.tmp" "\$LOG_FILE"
    fi
}

main "\$@"`,

  `#!/bin/bash

BACKUP_SOURCE="/var/www"
BACKUP_DEST="/backup"
DATABASE_NAME="myapp_db"
DATABASE_USER="backup_user"
RETENTION_DAYS=30
TIMESTAMP=\$(date +%Y%m%d_%H%M%S)
HOSTNAME=\$(hostname)

RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m'

# Logging function
log() {
    echo -e "[\$(date '+%Y-%m-%d %H:%M:%S')] \$1"
}

error_exit() {
    echo -e "\${RED}[\$(date '+%Y-%m-%d %H:%M:%S')] ERROR: \$1\${NC}" >&2
    exit 1
}

success() {
    echo -e "\${GREEN}[\$(date '+%Y-%m-%d %H:%M:%S')] SUCCESS: \$1\${NC}"
}

warning() {
    echo -e "\${YELLOW}[\$(date '+%Y-%m-%d %H:%M:%S')] WARNING: \$1\${NC}"
}

setup_backup_dirs() {
    local dirs=("files" "database" "logs")
    
    for dir in "\${dirs[@]}"; do
        mkdir -p "\$BACKUP_DEST/\$dir"
        if [ \$? -ne 0 ]; then
            error_exit "Failed to create backup directory: \$BACKUP_DEST/\$dir"
        fi
    done
    
    log "Backup directories created successfully"
}

backup_files() {
    log "Starting file backup..."
    
    local backup_file="\$BACKUP_DEST/files/files_\${HOSTNAME}_\${TIMESTAMP}.tar.gz"
    
    tar -czf "\$backup_file" \\
        --exclude='*.log' \\
        --exclude='*/cache/*' \\
        --exclude='*/tmp/*' \\
        --exclude='*/node_modules/*' \\
        -C "\$(dirname "\$BACKUP_SOURCE")" \\
        "\$(basename "\$BACKUP_SOURCE")" 2>/dev/null
    
    if [ \$? -eq 0 ]; then
        local file_size=\$(du -h "\$backup_file" | cut -f1)
        success "File backup completed: \$backup_file (\$file_size)"
    else
        error_exit "File backup failed"
    fi
}

backup_database() {
    log "Starting database backup..."
    
    local backup_file="\$BACKUP_DEST/database/db_\${DATABASE_NAME}_\${HOSTNAME}_\${TIMESTAMP}.sql.gz"
    
    if ! command -v mysqldump &> /dev/null; then
        warning "mysqldump not found, skipping database backup"
        return 0
    fi
    
    mysqldump \\
        --user="\$DATABASE_USER" \\
        --password \\
        --single-transaction \\
        --routines \\
        --triggers \\
        --events \\
        --add-drop-database \\
        --databases "\$DATABASE_NAME" | gzip > "\$backup_file"
    
    if [ \$? -eq 0 ]; then
        local file_size=\$(du -h "\$backup_file" | cut -f1)
        success "Database backup completed: \$backup_file (\$file_size)"
    else
        error_exit "Database backup failed"
    fi
}

backup_logs() {
    log "Starting log backup..."
    
    local backup_file="\$BACKUP_DEST/logs/logs_\${HOSTNAME}_\${TIMESTAMP}.tar.gz"
    
    tar -czf "\$backup_file" \\
        /var/log/nginx/ \\
        /var/log/mysql/ \\
        /var/log/apache2/ \\
        /var/log/auth.log \\
        /var/log/syslog \\
        2>/dev/null
    
    if [ \$? -eq 0 ]; then
        local file_size=\$(du -h "\$backup_file" | cut -f1)
        success "Log backup completed: \$backup_file (\$file_size)"
    else
        warning "Log backup completed with some errors (some logs may not exist)"
    fi
}

cleanup_old_backups() {
    log "Cleaning up backups older than \$RETENTION_DAYS days..."
    
    local deleted_count=0
    
    for backup_type in files database logs; do
        local old_files=\$(find "\$BACKUP_DEST/\$backup_type" -name "*.gz" -mtime +\$RETENTION_DAYS)
        
        if [ -n "\$old_files" ]; then
            echo "\$old_files" | while read -r file; do
                rm -f "\$file"
                if [ \$? -eq 0 ]; then
                    ((deleted_count++))
                    log "Deleted old backup: \$(basename "\$file")"
                fi
            done
        fi
    done
    
    if [ \$deleted_count -gt 0 ]; then
        success "Cleaned up \$deleted_count old backup files"
    else
        log "No old backup files to clean up"
    fi
}

generate_report() {
    local report_file="\$BACKUP_DEST/backup_report_\${TIMESTAMP}.txt"
    
    cat > "\$report_file" << EOF
Backup Report - \$(date)
=====================================

Hostname: \$HOSTNAME
Backup Date: \$(date '+%Y-%m-%d %H:%M:%S')
Backup Location: \$BACKUP_DEST

Backup Summary:
--------------
EOF

    for backup_type in files database logs; do
        local latest_backup=\$(find "\$BACKUP_DEST/\$backup_type" -name "*_\${TIMESTAMP}.*.gz" -type f 2>/dev/null | head -1)
        if [ -n "\$latest_backup" ]; then
            local size=\$(du -h "\$latest_backup" | cut -f1)
            echo "\$backup_type backup: \$size" >> "\$report_file"
        fi
    done
    
    echo "" >> "\$report_file"
    echo "Disk Usage:" >> "\$report_file"
    df -h "\$BACKUP_DEST" >> "\$report_file"
    
    success "Backup report generated: \$report_file"
}

main() {
    log "Starting backup process..."
    
    if [ "\$EUID" -ne 0 ]; then
        warning "Not running as root, some backups may fail"
    fi
    
    local available_space=\$(df "\$BACKUP_DEST" | awk 'NR==2 {print \$4}')
    if [ "\$available_space" -lt 1048576 ]; then
        warning "Low disk space available: \$(df -h "\$BACKUP_DEST" | awk 'NR==2 {print \$4}') free"
    fi
    
    setup_backup_dirs
    backup_files
    backup_database
    backup_logs
    cleanup_old_backups
    generate_report
    
    success "Backup process completed successfully"
}

trap 'error_exit "Backup interrupted by signal"' INT TERM

main "\$@"`,
];