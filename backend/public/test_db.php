<?php
/**
 * Verification Script to Test Database Class & Queries
 * Aligned with Rule 4.2 & Rule 4.3 (Standardized JSON API Responses)
 */

header('Content-Type: application/json');

// Autoload or require Database configuration
require_once __DIR__ . '/../config/Database.php';

use Config\Database;

try {
    // Get Database Instance (Singleton)
    $db = Database::getInstance();
    $conn = $db->getConnection();

    // Query categories using standard PDO prepared statements (Rule 4.2)
    $query = "SELECT id, name, slug, description FROM categories WHERE parent_id IS NOT NULL";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    $categories = $stmt->fetchAll();

    // Query mock products with their alternate image status (Rule 4.2)
    $productQuery = "
        SELECT p.id, p.name, p.price, p.sale_price, p.is_new, p.is_sale,
               GROUP_CONCAT(pi.image_url ORDER BY pi.sort_order) as images
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        GROUP BY p.id
    ";
    $productStmt = $conn->prepare($productQuery);
    $productStmt->execute();
    
    $products = $productStmt->fetchAll();

    // Format products for JSON response, parsing the grouped images
    $formattedProducts = array_map(function($prod) {
        $prod['images'] = $prod['images'] ? explode(',', $prod['images']) : [];
        return $prod;
    }, $products);

    // Standardized API success response (Rule 4.3)
    echo json_encode([
        'success' => true,
        'message' => 'Database connection and prepared statements verified successfully!',
        'data' => [
            'categories' => $categories,
            'products' => $formattedProducts
        ]
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    // Standardized API error response (Rule 4.3)
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Verification failed: ' . $e->getMessage()
    ]);
}
