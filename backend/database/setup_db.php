<?php
/**
 * Database Setup & Seeding Automation Script for SLY CLOTHING
 */
$host = "127.0.0.1";
$user = "root";
$pass = "";
$dbName = "sly_clothing";

try {
    echo "==================================================\n";
    echo "SLY CLOTHING Database Setup Script\n";
    echo "==================================================\n";

    // 1. Establish initial connection (without selecting DB)
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    echo "[1/4] Connected to MySQL Server successfully.\n";

    // 2. Read and execute schema.sql
    $schemaFile = __DIR__ . '/schema.sql';
    if (!file_exists($schemaFile)) {
        throw new Exception("Schema file not found at: $schemaFile");
    }
    
    $schemaSql = file_get_contents($schemaFile);
    echo "[2/4] Reading and executing schema.sql...\n";
    
    // Enable emulation of prepared statements to execute multiple queries at once
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, 1);
    $pdo->exec($schemaSql);
    echo "      Database '{$dbName}' and table structures created.\n";

    // 3. Read and execute seed.sql
    $seedFile = __DIR__ . '/seed.sql';
    if (!file_exists($seedFile)) {
        throw new Exception("Seed file not found at: $seedFile");
    }
    
    $seedSql = file_get_contents($seedFile);
    echo "[3/4] Reading and executing seed.sql...\n";
    $pdo->exec($seedSql);
    echo "      Seed data loaded successfully.\n";

    // 4. Verification
    echo "[4/4] Verifying database tables and integrity...\n";
    $pdo->exec("USE `{$dbName}`");
    
    // Disable emulation to get native database types for checks
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, 0);

    // List tables
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "      Tables in database '{$dbName}':\n";
    foreach ($tables as $table) {
        echo "        - {$table}\n";
    }

    // Check Categories Count
    $categoryCount = $pdo->query("SELECT COUNT(*) FROM `categories`")->fetchColumn();
    echo "      Categories Seeded: {$categoryCount}\n";

    // Check Products Count
    $productCount = $pdo->query("SELECT COUNT(*) FROM `products`")->fetchColumn();
    echo "      Products Seeded: {$productCount}\n";

    // Check User Count
    $userCount = $pdo->query("SELECT COUNT(*) FROM `users`")->fetchColumn();
    echo "      Users Seeded: {$userCount}\n";

    // Check Sample Order
    $orderCount = $pdo->query("SELECT COUNT(*) FROM `orders`")->fetchColumn();
    echo "      Orders Seeded: {$orderCount}\n";

    echo "==================================================\n";
    echo "DATABASE INITIALIZATION COMPLETED SUCCESSFULLY!\n";
    echo "==================================================\n";

} catch (Exception $e) {
    echo "Setup failed: " . $e->getMessage() . "\n";
    exit(1);
}
