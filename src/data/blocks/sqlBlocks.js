export const SQL_BLOCKS = [
  `CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    profile_picture_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_active (is_active),
    INDEX idx_created_at (created_at),
    INDEX idx_last_login (last_login_at)
);

CREATE TABLE user_profiles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    bio TEXT,
    website_url VARCHAR(255),
    location VARCHAR(255),
    timezone VARCHAR(50),
    language VARCHAR(10) DEFAULT 'en',
    notification_preferences JSON,
    privacy_settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_profile (user_id)
);

CREATE TABLE user_sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_user_sessions (user_id),
    INDEX idx_expires_at (expires_at)
);

DELIMITER //
CREATE PROCEDURE RegisterUser(
    IN p_email VARCHAR(255),
    IN p_password_hash VARCHAR(255),
    IN p_first_name VARCHAR(100),
    IN p_last_name VARCHAR(100),
    IN p_phone VARCHAR(20),
    OUT p_user_id BIGINT,
    OUT p_result VARCHAR(100)
)
BEGIN
    DECLARE user_exists INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_result = 'ERROR: Registration failed';
        SET p_user_id = 0;
    END;
    
    START TRANSACTION;
    
    SELECT COUNT(*) INTO user_exists 
    FROM users 
    WHERE email = p_email;
    
    IF user_exists > 0 THEN
        SET p_result = 'ERROR: Email already registered';
        SET p_user_id = 0;
        ROLLBACK;
    ELSE
        INSERT INTO users (email, password_hash, first_name, last_name, phone)
        VALUES (p_email, p_password_hash, p_first_name, p_last_name, p_phone);
        
        SET p_user_id = LAST_INSERT_ID();
        
        INSERT INTO user_profiles (user_id, notification_preferences, privacy_settings)
        VALUES (p_user_id, '{}', '{"profile_visibility": "public", "email_notifications": true}');
        
        SET p_result = 'SUCCESS: User registered successfully';
        COMMIT;
    END IF;
END //
DELIMITER ;`,

  `
SELECT 
    DATE_FORMAT(created_at, '%Y-%m') as registration_month,
    COUNT(*) as new_users,
    COUNT(CASE WHEN is_verified = TRUE THEN 1 END) as verified_users,
    ROUND((COUNT(CASE WHEN is_verified = TRUE THEN 1 END) * 100.0 / COUNT(*)), 2) as verification_rate
FROM users 
WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY registration_month DESC;

WITH user_activity AS (
    SELECT 
        u.id,
        u.email,
        u.created_at as registration_date,
        u.last_login_at,
        DATEDIFF(CURRENT_DATE, u.created_at) as days_since_registration,
        DATEDIFF(CURRENT_DATE, u.last_login_at) as days_since_last_login,
        CASE 
            WHEN u.last_login_at IS NULL THEN 'Never Logged In'
            WHEN DATEDIFF(CURRENT_DATE, u.last_login_at) <= 7 THEN 'Active'
            WHEN DATEDIFF(CURRENT_DATE, u.last_login_at) <= 30 THEN 'Recently Active'
            WHEN DATEDIFF(CURRENT_DATE, u.last_login_at) <= 90 THEN 'Inactive'
            ELSE 'Dormant'
        END as user_status
    FROM users u
    WHERE u.is_active = TRUE
)
SELECT 
    user_status,
    COUNT(*) as user_count,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM user_activity)), 2) as percentage,
    AVG(days_since_registration) as avg_days_registered,
    AVG(CASE WHEN days_since_last_login IS NOT NULL THEN days_since_last_login END) as avg_days_inactive
FROM user_activity
GROUP BY user_status
ORDER BY 
    CASE user_status
        WHEN 'Active' THEN 1
        WHEN 'Recently Active' THEN 2
        WHEN 'Inactive' THEN 3
        WHEN 'Dormant' THEN 4
        WHEN 'Never Logged In' THEN 5
    END;

SELECT 
    u.id,
    CONCAT(u.first_name, ' ', u.last_name) as full_name,
    u.email,
    u.created_at,
    u.last_login_at,
    COUNT(DISTINCT DATE(s.created_at)) as login_days,
    MAX(s.created_at) as most_recent_session,
    up.bio,
    up.location,
    JSON_UNQUOTE(JSON_EXTRACT(up.notification_preferences, '$.email_notifications')) as email_notifications_enabled
FROM users u
LEFT JOIN user_sessions s ON u.id = s.user_id
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE u.is_active = TRUE
    AND u.last_login_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
GROUP BY u.id, u.email, u.first_name, u.last_name, u.created_at, u.last_login_at, up.bio, up.location
HAVING login_days >= 5
ORDER BY login_days DESC, u.last_login_at DESC
LIMIT 25;`,

  `SELECT 
    TABLE_SCHEMA,
    TABLE_NAME,
    INDEX_NAME,
    CARDINALITY,
    CASE 
        WHEN CARDINALITY = 0 THEN 'Unused - Consider Dropping'
        WHEN CARDINALITY < 100 THEN 'Low Cardinality - Review'
        WHEN CARDINALITY > 10000 THEN 'High Cardinality - Good'
        ELSE 'Moderate Cardinality'
    END as index_status
FROM information_schema.STATISTICS 
WHERE TABLE_SCHEMA = DATABASE()
    AND INDEX_NAME != 'PRIMARY'
ORDER BY TABLE_NAME, CARDINALITY DESC;

SELECT 
    TABLE_NAME,
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) as 'Size (MB)',
    TABLE_ROWS as 'Row Count',
    ROUND((DATA_LENGTH / 1024 / 1024), 2) as 'Data Size (MB)',
    ROUND((INDEX_LENGTH / 1024 / 1024), 2) as 'Index Size (MB)',
    DATA_FREE as 'Free Space (Bytes)',
    ENGINE,
    TABLE_COLLATION,
    CASE 
        WHEN DATA_FREE > 0 THEN 'OPTIMIZE TABLE recommended'
        WHEN (INDEX_LENGTH / DATA_LENGTH) > 1 THEN 'Review indexes - high overhead'
        WHEN TABLE_ROWS > 100000 AND ENGINE != 'InnoDB' THEN 'Consider InnoDB engine'
        ELSE 'Table appears optimized'
    END as recommendation
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_TYPE = 'BASE TABLE'
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;

DELETE FROM user_sessions 
WHERE expires_at < CURRENT_TIMESTAMP;

UPDATE users u
SET u.updated_at = CURRENT_TIMESTAMP
WHERE u.id IN (
    SELECT DISTINCT user_id 
    FROM user_sessions 
    WHERE created_at >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 HOUR)
);

DELETE up FROM user_profiles up
LEFT JOIN users u ON up.user_id = u.id
WHERE u.id IS NULL;

SELECT 
    'Active Users (Last 24h)' as metric,
    COUNT(DISTINCT user_id) as value
FROM user_sessions 
WHERE created_at >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 24 HOUR)

UNION ALL

SELECT 
    'Total Registered Users' as metric,
    COUNT(*) as value
FROM users 
WHERE is_active = TRUE

UNION ALL

SELECT 
    'Verified Users' as metric,
    COUNT(*) as value
FROM users 
WHERE is_verified = TRUE AND is_active = TRUE

UNION ALL

SELECT 
    'Users Registered Today' as metric,
    COUNT(*) as value
FROM users 
WHERE DATE(created_at) = CURRENT_DATE

UNION ALL

SELECT 
    'Average Session Duration (minutes)' as metric,
    ROUND(AVG(TIMESTAMPDIFF(MINUTE, created_at, expires_at)), 2) as value
FROM user_sessions 
WHERE created_at >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 7 DAY);`,
];