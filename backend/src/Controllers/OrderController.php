<?php
namespace Controllers;

use Models\Order;

class OrderController {
    private Order $orderModel;

    public function __construct() {
        $this->orderModel = new Order();
    }

    public function createOrder(array $data) {
        $items = $data['items'] ?? [];
        $shippingAddress = trim($data['shipping_address'] ?? '');
        $paymentMethod = $data['payment_method'] ?? 'COD';
        $notes = trim($data['notes'] ?? '');

        // Validation
        if (empty($items) || !is_array($items)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Shopping cart is empty.']);
            return;
        }

        if (empty($shippingAddress)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Shipping address is required.']);
            return;
        }

        // Set User details from session or guest form parameters
        $orderData = [
            'shipping_address' => $shippingAddress,
            'payment_method' => $paymentMethod,
            'notes' => $notes,
            'subtotal' => (float)($data['subtotal'] ?? 0),
            'discount' => (float)($data['discount'] ?? 0),
            'shipping_fee' => (float)($data['shipping_fee'] ?? 0),
            'total_amount' => (float)($data['total_amount'] ?? 0)
        ];

        if (isset($_SESSION['user_id'])) {
            $orderData['user_id'] = (int)$_SESSION['user_id'];
        } else {
            $guestName = trim($data['guest_name'] ?? '');
            $guestEmail = trim($data['guest_email'] ?? '');
            $guestPhone = trim($data['guest_phone'] ?? '');

            if (empty($guestName) || empty($guestPhone)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Guest name and phone number are required for checkout.']);
                return;
            }

            $orderData['guest_name'] = $guestName;
            $orderData['guest_email'] = $guestEmail;
            $orderData['guest_phone'] = $guestPhone;
        }

        try {
            // Process order checkout transaction
            $orderCode = $this->orderModel->create($orderData, $items);

            echo json_encode([
                'success' => true,
                'message' => 'Order placed successfully.',
                'data' => [
                    'order_code' => $orderCode
                ]
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Checkout failed: ' . $e->getMessage()
            ]);
        }
    }

    public function getUserOrders() {
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Unauthorized. No active session.']);
            return;
        }

        try {
            $userId = (int)$_SESSION['user_id'];
            $orders = $this->orderModel->getUserOrderHistory($userId);

            echo json_encode([
                'success' => true,
                'data' => $orders
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function trackOrder() {
        $orderCode = trim($_GET['order_code'] ?? '');
        $phone = trim($_GET['phone'] ?? '');

        if (empty($orderCode)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Order tracking code is required.']);
            return;
        }

        try {
            $order = $this->orderModel->findByCodeOrPhone($orderCode, empty($phone) ? null : $phone);

            if (!$order) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Order not found. Please verify the code and phone number.'
                ]);
                return;
            }

            echo json_encode([
                'success' => true,
                'data' => $order
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function getSystemOrders() {
        if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Forbidden. Admin privileges required.']);
            return;
        }

        try {
            $orders = $this->orderModel->getAllOrders();
            echo json_encode([
                'success' => true,
                'data' => $orders
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function updateOrderStatus(array $data) {
        if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Forbidden. Admin privileges required.']);
            return;
        }

        $orderId = (int)($data['order_id'] ?? 0);
        $status = trim($data['status'] ?? '');

        if ($orderId <= 0 || empty($status)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Order ID and status are required.']);
            return;
        }

        $validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!in_array($status, $validStatuses)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid order status value.']);
            return;
        }

        try {
            $success = $this->orderModel->updateOrderStatus($orderId, $status);
            if ($success) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Order status updated successfully.'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Failed to update order status.'
                ]);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
}

