<?php
namespace Controllers;

use Models\BehaviorLog;

class AnalyticsController {
    private BehaviorLog $model;

    public function __construct() {
        $this->model = new BehaviorLog();
    }

    public function logBehavior(array $data) {
        $actionType = trim($data['action_type'] ?? '');
        $pageUrl = trim($data['page_url'] ?? '');
        $sessionId = trim($data['session_id'] ?? '');

        if (empty($actionType) || empty($pageUrl) || empty($sessionId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing required log fields (action_type, page_url, session_id).']);
            return;
        }

        // Gather telemetry properties
        $logData = [
            'session_id' => $sessionId,
            'action_type' => $actionType,
            'page_url' => $pageUrl,
            'element_id' => $data['element_id'] ?? null,
            'duration_seconds' => isset($data['duration_seconds']) ? (float)$data['duration_seconds'] : null,
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
            'payload' => $data['payload'] ?? []
        ];

        // Enrich with user ID if customer is logged in
        if (isset($_SESSION['user_id'])) {
            $logData['user_id'] = (int)$_SESSION['user_id'];
        }

        try {
            $this->model->create($logData);
            echo json_encode(['success' => true, 'message' => 'Interaction logged.']);
        } catch (\Exception $e) {
            // Silently fail or send 500 but log error (prevent throwing error to user on analytics)
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    public function getBehaviorLogs() {
        if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Forbidden. Admin privileges required.']);
            return;
        }

        try {
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
            $logs = $this->model->getAllLogs($limit);
            echo json_encode(['success' => true, 'data' => $logs]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }
}
