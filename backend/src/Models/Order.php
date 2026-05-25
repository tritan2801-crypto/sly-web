<?php
namespace Models;

use Config\Database;
use PDO;
use Exception;

class Order {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create(array $orderData, array $items): string {
        $this->db->beginTransaction();

        try {
            // 1. Generate a unique order tracking code
            $orderCode = 'SLY-' . strtoupper(bin2hex(random_bytes(4)));

            // 2. Insert order details
            $stmt = $this->db->prepare("
                INSERT INTO orders (
                    order_code, user_id, guest_name, guest_email, guest_phone, 
                    shipping_address, subtotal, discount, shipping_fee, total_amount, 
                    payment_method, payment_status, order_status, notes
                ) VALUES (
                    :order_code, :user_id, :guest_name, :guest_email, :guest_phone, 
                    :shipping_address, :subtotal, :discount, :shipping_fee, :total_amount, 
                    :payment_method, 'pending', 'pending', :notes
                )
            ");
            
            $stmt->execute([
                'order_code' => $orderCode,
                'user_id' => $orderData['user_id'] ?? null,
                'guest_name' => $orderData['guest_name'] ?? null,
                'guest_email' => $orderData['guest_email'] ?? null,
                'guest_phone' => $orderData['guest_phone'] ?? null,
                'shipping_address' => $orderData['shipping_address'],
                'subtotal' => $orderData['subtotal'],
                'discount' => $orderData['discount'] ?? 0,
                'shipping_fee' => $orderData['shipping_fee'] ?? 0,
                'total_amount' => $orderData['total_amount'],
                'payment_method' => $orderData['payment_method'] ?? 'COD',
                'notes' => $orderData['notes'] ?? null
            ]);

            $orderId = (int)$this->db->lastInsertId();

            // 3. Insert items and decrement variant stock
            foreach ($items as $item) {
                // Check variant stock first
                $stockStmt = $this->db->prepare("SELECT stock FROM product_variants WHERE id = :variant_id FOR UPDATE");
                $stockStmt->execute(['variant_id' => $item['variant_id']]);
                $currentStock = $stockStmt->fetchColumn();

                if ($currentStock === false) {
                    throw new Exception("Product variant not found.");
                }

                if ($currentStock < $item['quantity']) {
                    throw new Exception("Insufficient stock for variant ID: " . $item['variant_id']);
                }

                // Insert order item
                $itemStmt = $this->db->prepare("
                    INSERT INTO order_items (order_id, product_variant_id, quantity, price) 
                    VALUES (:order_id, :variant_id, :quantity, :price)
                ");
                $itemStmt->execute([
                    'order_id' => $orderId,
                    'variant_id' => $item['variant_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price']
                ]);

                // Decrement stock
                $decStmt = $this->db->prepare("
                    UPDATE product_variants 
                    SET stock = stock - :qty 
                    WHERE id = :variant_id
                ");
                $decStmt->execute([
                    'qty' => $item['quantity'],
                    'variant_id' => $item['variant_id']
                ]);
            }

            // 4. Update Loyalty Points if user is logged in
            // Rule: 10,000 VND spent = 1 Point
            if (!empty($orderData['user_id'])) {
                $pointsEarned = floor($orderData['total_amount'] / 10000);
                if ($pointsEarned > 0) {
                    $userModel = new User();
                    $userModel->addLoyaltyPoints($orderData['user_id'], (int)$pointsEarned);
                }
            }

            $this->db->commit();
            return $orderCode;

        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function findByCodeOrPhone(string $orderCode, ?string $phone = null): ?array {
        $sql = "
            SELECT o.*, u.name as user_name
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.order_code = :order_code
        ";
        $params = ['order_code' => $orderCode];

        if (!empty($phone)) {
            $sql .= " AND (o.guest_phone = :phone OR u.phone = :phone)";
            $params['phone'] = $phone;
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $order = $stmt->fetch();

        if (!$order) {
            return null;
        }

        $order['items'] = $this->getOrderItems((int)$order['id']);
        return $order;
    }

    public function getUserOrderHistory(int $userId): array {
        $stmt = $this->db->prepare("
            SELECT id, order_code, total_amount, order_status, created_at 
            FROM orders 
            WHERE user_id = :user_id 
            ORDER BY created_at DESC
        ");
        $stmt->execute(['user_id' => $userId]);
        $orders = $stmt->fetchAll();

        foreach ($orders as &$order) {
            $order['items'] = $this->getOrderItems((int)$order['id']);
        }

        return $orders;
    }

    public function getAllOrders(): array {
        $stmt = $this->db->prepare("
            SELECT o.*, u.name as customer_name, u.email as customer_email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        ");
        $stmt->execute();
        $orders = $stmt->fetchAll();

        foreach ($orders as &$order) {
            $order['items'] = $this->getOrderItems((int)$order['id']);
        }

        return $orders;
    }

    public function updateOrderStatus(int $orderId, string $status): bool {
        $stmt = $this->db->prepare("
            UPDATE orders 
            SET order_status = :status 
            WHERE id = :id
        ");
        return $stmt->execute([
            'id' => $orderId,
            'status' => $status
        ]);
    }

    private function getOrderItems(int $orderId): array {
        $stmt = $this->db->prepare("
            SELECT oi.id, oi.quantity, oi.price, pv.size, pv.color, p.name as product_name, p.slug as product_slug,
                   (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_hover_alternate = 0 LIMIT 1) as product_image
            FROM order_items oi
            LEFT JOIN product_variants pv ON oi.product_variant_id = pv.id
            LEFT JOIN products p ON pv.product_id = p.id
            WHERE oi.order_id = :order_id
        ");
        $stmt->execute(['order_id' => $orderId]);
        return $stmt->fetchAll();
    }
}
