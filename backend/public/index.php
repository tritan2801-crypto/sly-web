<?php
/**
 * API Front Controller & Router for SLY CLOTHING
 * Handles CORS, autoloding, and RESTful routing mapping
 */

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Set JSON content header
header('Content-Type: application/json; charset=utf-8');

// Start session for login state tracking
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 1. PSR-4 Autoloader
spl_autoload_register(function ($class) {
    // Map namespace back to folder structure
    $classPath = str_replace('\\', DIRECTORY_SEPARATOR, $class);
    
    // Check if namespace starts with Config
    if (strpos($class, 'Config\\') === 0) {
        $file = __DIR__ . '/../config/' . substr($classPath, 7) . '.php';
    } else {
        $file = __DIR__ . '/../src/' . $classPath . '.php';
    }
    
    if (file_exists($file)) {
        require_once $file;
    }
});

// 2. Parse URL path and method
$requestUri = $_SERVER['REQUEST_URI'];
$basePath = '/backend/public/index.php';

// Remove base path from URI if present
if (strpos($requestUri, $basePath) === 0) {
    $requestPath = substr($requestUri, strlen($basePath));
} else {
    // Fallback for rewrite rules if running directly in subdirectory
    $requestPath = parse_url($requestUri, PHP_URL_PATH);
    $requestPath = str_replace('/backend/public', '', $requestPath);
}

$requestPath = rtrim(explode('?', $requestPath)[0], '/');
$method = $_SERVER['REQUEST_METHOD'];

// Helper to extract JSON request body
function getJsonInput() {
    $json = file_get_contents('php://input');
    return json_decode($json, true) ?? [];
}

// Helper to send JSON error response
function sendError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['success' => false, 'error' => $message]);
    exit;
}

// 3. Routing Map
try {
    switch ($requestPath) {
        // --- CATEGORIES & PRODUCTS ---
        case '/api/categories':
            if ($method === 'GET') {
                $controller = new Controllers\ProductController();
                $controller->getCategories();
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        case '/api/products':
            if ($method === 'GET') {
                $controller = new Controllers\ProductController();
                $controller->getProducts();
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        case '/api/products/detail':
            if ($method === 'GET') {
                $controller = new Controllers\ProductController();
                $controller->getProductDetail();
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        // --- AUTHENTICATION & PROFILE ---
        case '/api/auth/register':
            if ($method === 'POST') {
                $controller = new Controllers\AuthController();
                $controller->register(getJsonInput());
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        case '/api/auth/login':
            if ($method === 'POST') {
                $controller = new Controllers\AuthController();
                $controller->login(getJsonInput());
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        case '/api/auth/logout':
            if ($method === 'POST') {
                $controller = new Controllers\AuthController();
                $controller->logout();
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        case '/api/auth/me':
            if ($method === 'GET') {
                $controller = new Controllers\AuthController();
                $controller->getCurrentUser();
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        case '/api/auth/update-profile':
            if ($method === 'POST') {
                $controller = new Controllers\AuthController();
                $controller->updateProfile(getJsonInput());
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        case '/api/auth/change-password':
            if ($method === 'POST') {
                $controller = new Controllers\AuthController();
                $controller->changePassword(getJsonInput());
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        // --- ORDERS ---
        case '/api/orders':
            if ($method === 'POST') {
                $controller = new Controllers\OrderController();
                $controller->createOrder(getJsonInput());
            } elseif ($method === 'GET') {
                $controller = new Controllers\OrderController();
                $controller->getUserOrders();
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        case '/api/order/track':
            if ($method === 'GET') {
                $controller = new Controllers\OrderController();
                $controller->trackOrder();
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        // --- ANALYTICS ---
        case '/api/analytics':
            if ($method === 'POST') {
                $controller = new Controllers\AnalyticsController();
                $controller->logBehavior(getJsonInput());
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        // --- ADMIN ---
        case '/api/admin/orders':
            if ($method === 'GET') {
                $controller = new Controllers\OrderController();
                $controller->getSystemOrders();
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        case '/api/admin/orders/update-status':
            if ($method === 'POST') {
                $controller = new Controllers\OrderController();
                $controller->updateOrderStatus(getJsonInput());
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        case '/api/admin/analytics':
            if ($method === 'GET') {
                $controller = new Controllers\AnalyticsController();
                $controller->getBehaviorLogs();
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        case '/api/admin/products':
            if ($method === 'GET') {
                $controller = new Controllers\ProductController();
                $controller->getAdminProducts();
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        case '/api/admin/products/create':
            if ($method === 'POST') {
                $controller = new Controllers\ProductController();
                $controller->createProduct(getJsonInput());
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        case '/api/admin/products/update':
            if ($method === 'POST') {
                $controller = new Controllers\ProductController();
                $controller->updateProduct(getJsonInput());
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        case '/api/admin/products/delete':
            if ($method === 'POST') {
                $controller = new Controllers\ProductController();
                $controller->deleteProduct(getJsonInput());
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        case '/api/admin/categories/create':
            if ($method === 'POST') {
                $controller = new Controllers\ProductController();
                $controller->createCategory(getJsonInput());
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        case '/api/admin/categories/update':
            if ($method === 'POST') {
                $controller = new Controllers\ProductController();
                $controller->updateCategory(getJsonInput());
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        case '/api/admin/categories/delete':
            if ($method === 'POST') {
                $controller = new Controllers\ProductController();
                $controller->deleteCategory(getJsonInput());
            } else {
                sendError("Method not allowed", 450);
            }
            break;

        default:
            sendError("Route not found: " . $requestPath, 404);
            break;
    }
} catch (Exception $e) {
    sendError("Server error: " . $e->getMessage(), 500);
}
