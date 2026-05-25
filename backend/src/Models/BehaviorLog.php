<?php
namespace Models;

use Config\Database;
use PDO;

class BehaviorLog {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create(array $logData): bool {
        $stmt = $this->db->prepare("
            INSERT INTO behavior_logs (
                session_id, user_id, action_type, page_url, element_id, 
                duration_seconds, ip_address, user_agent, payload
            ) VALUES (
                :session_id, :user_id, :action_type, :page_url, :element_id, 
                :duration_seconds, :ip_address, :user_agent, :payload
            )
        ");

        $payload = isset($logData['payload']) ? json_encode($logData['payload']) : null;

        return $stmt->execute([
            'session_id' => $logData['session_id'],
            'user_id' => $logData['user_id'] ?? null,
            'action_type' => $logData['action_type'],
            'page_url' => $logData['page_url'],
            'element_id' => $logData['element_id'] ?? null,
            'duration_seconds' => $logData['duration_seconds'] ?? null,
            'ip_address' => $logData['ip_address'] ?? null,
            'user_agent' => $logData['user_agent'] ?? null,
            'payload' => $payload
        ]);
    }

    public function getAllLogs(int $limit = 100): array {
        $stmt = $this->db->prepare("
            SELECT id, session_id, user_id, action_type, page_url, element_id, duration_seconds, payload, created_at
            FROM behavior_logs
            ORDER BY created_at DESC
            LIMIT :limit
        ");
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
