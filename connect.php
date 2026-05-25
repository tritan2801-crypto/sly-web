<?php
/**
 * Test MySQL Database Connection (PDO)
 * Target Database: sly_clothing (as seen in phpMyAdmin)
 */

header('Content-Type: application/json; charset=utf-8');

$host = '127.0.0.1'; // or 'localhost'
$db_name = 'sly_clothing';
$username = 'root';
$password = ''; // password is empty as seen in default local phpMyAdmin
$port = '3306';

try {
    $dsn = "mysql:host={$host};port={$port};dbname={$db_name};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    $pdo = new PDO($dsn, $username, $password, $options);

    // Count the number of products in the products table
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM products");
    $result = $stmt->fetch();
    $totalProducts = $result['total'];

    echo json_encode([
        'success' => true,
        'message' => 'Kết nối cơ sở dữ liệu MySQL thành công!',
        'database' => $db_name,
        'total_products' => $totalProducts,
        'info' => 'Hệ thống đã nhận diện được toàn bộ bảng dữ liệu sản phẩm trong phpMyAdmin.'
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Kết nối cơ sở dữ liệu thất bại: ' . $e->getMessage()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
