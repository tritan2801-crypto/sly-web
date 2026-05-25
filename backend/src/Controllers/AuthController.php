<?php
namespace Controllers;

use Models\User;

class AuthController {
    private User $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    public function register(array $data) {
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $password = $data['password'] ?? '';

        if (empty($name) || empty($email) || empty($phone) || empty($password)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'All fields (name, email, phone, password) are required.']);
            return;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid email address format.']);
            return;
        }

        try {
            // Check if email already exists
            if ($this->userModel->findByEmail($email) !== null) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Email address is already registered.']);
                return;
            }

            // Hash password securely (Rule 4.2)
            $passwordHash = password_hash($password, PASSWORD_BCRYPT);

            // Create user
            $userId = $this->userModel->create($name, $email, $phone, $passwordHash);

            // Assign Customer Role (Role ID = 3)
            $this->userModel->assignRole($userId, 3);

            // Create loyalty system record
            $this->userModel->createLoyaltyRecord($userId);

            // Store user details in session
            $_SESSION['user_id'] = $userId;
            $_SESSION['user_email'] = $email;
            $_SESSION['user_name'] = $name;
            $_SESSION['user_role'] = 'customer';

            echo json_encode([
                'success' => true,
                'message' => 'Registration successful.',
                'data' => [
                    'id' => $userId,
                    'name' => $name,
                    'email' => $email,
                    'phone' => $phone
                ]
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    public function login(array $data) {
        $email = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';

        if (empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Email and password are required.']);
            return;
        }

        try {
            $user = $this->userModel->findByEmail($email);

            if (!$user || !password_verify($password, $user['password_hash'])) {
                http_response_code(401);
                echo json_encode(['success' => false, 'error' => 'Invalid email or password.']);
                return;
            }

            if ($user['status'] !== 'active') {
                http_response_code(403);
                echo json_encode(['success' => false, 'error' => 'Account is suspended or inactive.']);
                return;
            }

            // Fetch detail profile with role
            $profile = $this->userModel->findById($user['id']);

            // Save in session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_role'] = $profile['role'] ?? 'customer';

            echo json_encode([
                'success' => true,
                'message' => 'Login successful.',
                'data' => $profile
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    public function logout() {
        // Clear session variables
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();

        echo json_encode([
            'success' => true,
            'message' => 'Logged out successfully.'
        ]);
    }

    public function getCurrentUser() {
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Unauthorized. No active session.']);
            return;
        }

        try {
            $userId = (int)$_SESSION['user_id'];
            $profile = $this->userModel->findById($userId);
            
            if (!$profile) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'User profile not found.']);
                return;
            }

            // Fetch user loyalty points & membership tier
            $profile['loyalty'] = $this->userModel->getUserLoyalty($userId);

            echo json_encode([
                'success' => true,
                'data' => $profile
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    public function updateProfile(array $data) {
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Unauthorized. No active session.']);
            return;
        }

        $userId = (int)$_SESSION['user_id'];
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $phone = trim($data['phone'] ?? '');

        if (empty($name) || empty($email) || empty($phone)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'All fields (name, email, phone) are required.']);
            return;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid email address format.']);
            return;
        }

        try {
            // Check if email already exists for another user
            $existing = $this->userModel->findByEmail($email);
            if ($existing !== null && (int)$existing['id'] !== $userId) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Email address is already in use by another account.']);
                return;
            }

            $success = $this->userModel->updateProfile($userId, $name, $email, $phone);
            if ($success) {
                // Update session
                $_SESSION['user_email'] = $email;
                $_SESSION['user_name'] = $name;

                $profile = $this->userModel->findById($userId);
                $profile['loyalty'] = $this->userModel->getUserLoyalty($userId);

                echo json_encode([
                    'success' => true,
                    'message' => 'Profile updated successfully.',
                    'data' => $profile
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Failed to update profile details.']);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    public function changePassword(array $data) {
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Unauthorized. No active session.']);
            return;
        }

        $userId = (int)$_SESSION['user_id'];
        $oldPassword = $data['old_password'] ?? '';
        $newPassword = $data['new_password'] ?? '';

        if (empty($oldPassword) || empty($newPassword)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Old password and new password are required.']);
            return;
        }

        try {
            // Find user
            $userStmt = $this->userModel->findByEmail($_SESSION['user_email']);
            if (!$userStmt || !password_verify($oldPassword, $userStmt['password_hash'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Mật khẩu cũ không chính xác.']);
                return;
            }

            $newPasswordHash = password_hash($newPassword, PASSWORD_BCRYPT);
            $success = $this->userModel->updatePassword($userId, $newPasswordHash);

            if ($success) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Password updated successfully.'
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Failed to update password.']);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }
}
