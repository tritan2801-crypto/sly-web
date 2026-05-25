<?php
namespace Models;

use Config\Database;
use PDO;

class User {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function findByEmail(string $email): ?array {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();
        return $user ? $user : null;
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("
            SELECT u.id, u.name, u.email, u.phone, u.status, u.created_at, r.name as role
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            WHERE u.id = :id
        ");
        $stmt->execute(['id' => $id]);
        $user = $stmt->fetch();
        return $user ? $user : null;
    }

    public function create(string $name, string $email, string $phone, string $passwordHash): int {
        $stmt = $this->db->prepare("
            INSERT INTO users (name, email, phone, password_hash, status) 
            VALUES (:name, :email, :phone, :password_hash, 'active')
        ");
        $stmt->execute([
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'password_hash' => $passwordHash
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function assignRole(int $userId, int $roleId): bool {
        $stmt = $this->db->prepare("INSERT INTO user_roles (user_id, role_id) VALUES (:user_id, :role_id)");
        return $stmt->execute([
            'user_id' => $userId,
            'role_id' => $roleId
        ]);
    }

    public function getUserLoyalty(int $userId): ?array {
        $stmt = $this->db->prepare("
            SELECT cl.current_points, cl.lifetime_points, mt.name as tier_name, mt.discount_percentage, mt.min_points
            FROM customer_loyalty cl
            LEFT JOIN membership_tiers mt ON cl.membership_tier_id = mt.id
            WHERE cl.user_id = :user_id
        ");
        $stmt->execute(['user_id' => $userId]);
        $loyalty = $stmt->fetch();
        return $loyalty ? $loyalty : null;
    }

    public function createLoyaltyRecord(int $userId): bool {
        $stmt = $this->db->prepare("
            INSERT INTO customer_loyalty (user_id, current_points, lifetime_points, membership_tier_id) 
            VALUES (:user_id, 0, 0, 1)
        ");
        return $stmt->execute(['user_id' => $userId]);
    }

    public function addLoyaltyPoints(int $userId, int $points): bool {
        // Add points
        $stmt = $this->db->prepare("
            UPDATE customer_loyalty 
            SET current_points = current_points + :points1, 
                lifetime_points = lifetime_points + :points2 
            WHERE user_id = :user_id
        ");
        $success = $stmt->execute([
            'points1' => $points,
            'points2' => $points,
            'user_id' => $userId
        ]);

        if ($success) {
            $this->checkAndUpdateMembershipTier($userId);
        }

        return $success;
    }

    private function checkAndUpdateMembershipTier(int $userId): void {
        // Get lifetime points
        $stmt = $this->db->prepare("SELECT lifetime_points FROM customer_loyalty WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $userId]);
        $lifetimePoints = (int)$stmt->fetchColumn();

        // Get matching membership tier
        $tierStmt = $this->db->prepare("
            SELECT id FROM membership_tiers 
            WHERE min_points <= :points 
            ORDER BY min_points DESC 
            LIMIT 1
        ");
        $tierStmt->execute(['points' => $lifetimePoints]);
        $tierId = $tierStmt->fetchColumn();

        if ($tierId) {
            $updateStmt = $this->db->prepare("
                UPDATE customer_loyalty 
                SET membership_tier_id = :tier_id 
                WHERE user_id = :user_id
            ");
            $updateStmt->execute([
                'tier_id' => $tierId,
                'user_id' => $userId
            ]);
        }
    }

    public function updateProfile(int $id, string $name, string $email, string $phone): bool {
        $stmt = $this->db->prepare("
            UPDATE users 
            SET name = :name, email = :email, phone = :phone 
            WHERE id = :id
        ");
        return $stmt->execute([
            'id' => $id,
            'name' => $name,
            'email' => $email,
            'phone' => $phone
        ]);
    }

    public function updatePassword(int $id, string $passwordHash): bool {
        $stmt = $this->db->prepare("
            UPDATE users 
            SET password_hash = :password_hash 
            WHERE id = :id
        ");
        return $stmt->execute([
            'id' => $id,
            'password_hash' => $passwordHash
        ]);
    }
}
