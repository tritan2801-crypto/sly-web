<?php
namespace Config;

use PDO;
use PDOException;

/**
 * Singleton class to manage the MySQL database connection using PDO.
 * Aligned with Rule 4.2 (Strict Security & PDO for MySQL).
 */
class Database {
    private static ?Database $instance = null;
    private ?PDO $conn = null;

    // Database credentials - easily customizable or readable from environment variables
    private string $host = '127.0.0.1';
    private string $db_name = 'sly_clothing';
    private string $username = 'root';
    private string $password = '';
    private string $port = '3306';

    /**
     * Private constructor to prevent direct instantiation.
     */
    private function __construct() {
        try {
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->db_name};charset=utf8mb4";
            
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false, // Use native prepared statements for security
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
            ];

            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $exception) {
            // Standardized API response on database connection error
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Database connection failed: ' . $exception->getMessage()
            ]);
            exit;
        }
    }

    /**
     * Prevent cloning of the instance.
     */
    private function __clone() {}

    /**
     * Prevent unserializing of the instance.
     */
    public function __wakeup() {
        throw new \Exception("Cannot unserialize a singleton.");
    }

    /**
     * Gets the active database connection instance.
     *
     * @return Database
     */
    public static function getInstance(): Database {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Gets the PDO connection object.
     *
     * @return PDO
     */
    public function getConnection(): PDO {
        return $this->conn;
    }
}
