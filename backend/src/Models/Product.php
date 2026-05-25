<?php
namespace Models;

use Config\Database;
use PDO;

class Product {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getCategories(): array {
        $stmt = $this->db->prepare("SELECT * FROM categories ORDER BY parent_id ASC, id ASC");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getProducts(?int $categoryId = null, ?string $search = null, ?string $sort = null, ?float $minPrice = null, ?float $maxPrice = null, ?string $size = null, ?string $categoryGroup = null, ?int $page = null, ?int $limit = null): array {
        $whereSql = "";
        $params = [];

        // Apply Category filter (include child categories if parent is selected)
        if ($categoryId !== null) {
            $whereSql .= " AND (p.category_id = :category_id OR p.category_id IN (SELECT id FROM categories WHERE parent_id = :category_id_parent))";
            $params['category_id'] = $categoryId;
            $params['category_id_parent'] = $categoryId;
        }

        // Apply Category Group filter
        if ($categoryGroup !== null && $categoryGroup !== '') {
            if ($categoryGroup === 'tops') {
                $whereSql .= " AND p.category_id IN (11, 12, 13)";
            } elseif ($categoryGroup === 'outwears') {
                $whereSql .= " AND p.category_id IN (21, 22, 23)";
            } elseif ($categoryGroup === 'bottoms') {
                $whereSql .= " AND p.category_id IN (31, 32)";
            } elseif ($categoryGroup === 'accessories') {
                $whereSql .= " AND p.category_id IN (41, 42, 43)";
            }
        }

        // Apply Search filter
        if (!empty($search)) {
            $whereSql .= " AND (p.name LIKE :search OR p.description LIKE :search_desc)";
            $params['search'] = "%$search%";
            $params['search_desc'] = "%$search%";
        }

        // Apply Price filter
        if ($minPrice !== null) {
            $whereSql .= " AND COALESCE(p.sale_price, p.price) >= :min_price";
            $params['min_price'] = $minPrice;
        }
        if ($maxPrice !== null) {
            $whereSql .= " AND COALESCE(p.sale_price, p.price) <= :max_price";
            $params['max_price'] = $maxPrice;
        }

        // Apply Size filter
        if (!empty($size)) {
            $whereSql .= " AND pv.size = :size AND pv.stock > 0";
            $params['size'] = $size;
        }

        // 1. Get Total Count (if paginated)
        $totalCount = 0;
        if ($page !== null) {
            $countSql = "
                SELECT COUNT(DISTINCT p.id)
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN product_variants pv ON p.id = pv.product_id
                WHERE p.status = 'active' {$whereSql}
            ";
            $countStmt = $this->db->prepare($countSql);
            $countStmt->execute($params);
            $totalCount = (int)$countStmt->fetchColumn();
        }

        // 2. Order Clause
        $orderSql = "";
        switch ($sort) {
            case 'price_asc':
                $orderSql .= " ORDER BY COALESCE(p.sale_price, p.price) ASC";
                break;
            case 'price_desc':
                $orderSql .= " ORDER BY COALESCE(p.sale_price, p.price) DESC";
                break;
            case 'newest':
                $orderSql .= " ORDER BY p.created_at DESC";
                break;
            default:
                $orderSql .= " ORDER BY p.is_new DESC, p.created_at DESC";
                break;
        }

        // 3. Limit / Offset Clause
        $limitSql = "";
        if ($page !== null && $limit !== null) {
            $offset = ($page - 1) * $limit;
            $limitSql = " LIMIT :limit OFFSET :offset";
        }

        $sql = "
            SELECT DISTINCT p.id, p.category_id, p.name, p.slug, p.description, p.price, p.sale_price, p.is_new, p.is_sale, p.status, p.created_at, c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_variants pv ON p.id = pv.product_id
            WHERE p.status = 'active' {$whereSql}
            {$orderSql}
            {$limitSql}
        ";

        $stmt = $this->db->prepare($sql);

        // Bind regular parameters
        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val);
        }

        // Bind Limit and Offset as integers (crucial for native prepares in MySQL/PDO)
        if ($page !== null && $limit !== null) {
            $stmt->bindValue('limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue('offset', (int)$offset, PDO::PARAM_INT);
        }

        $stmt->execute();
        $products = $stmt->fetchAll();

        // Fetch images for each product
        foreach ($products as &$product) {
            $product['images'] = $this->getProductImages($product['id']);
        }

        if ($page !== null) {
            return [
                'products' => $products,
                'total' => $totalCount
            ];
        }

        return $products;
    }

    public function getProductDetail($slugOrId): ?array {
        $column = is_numeric($slugOrId) ? 'id' : 'slug';
        
        $stmt = $this->db->prepare("
            SELECT p.*, c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.{$column} = :val
        ");
        $stmt->execute(['val' => $slugOrId]);
        $product = $stmt->fetch();

        if (!$product) {
            return null;
        }

        // Fetch detailed product images
        $product['images'] = $this->getProductImages($product['id']);

        // Fetch size and color variants
        $variantStmt = $this->db->prepare("
            SELECT id, size, color, stock, sku 
            FROM product_variants 
            WHERE product_id = :product_id 
            ORDER BY FIELD(size, 'S', 'M', 'L', 'XL', 'OS')
        ");
        $variantStmt->execute(['product_id' => $product['id']]);
        $product['variants'] = $variantStmt->fetchAll();

        return $product;
    }

    private function getProductImages(int $productId): array {
        $stmt = $this->db->prepare("
            SELECT image_url, sort_order, is_hover_alternate 
            FROM product_images 
            WHERE product_id = :product_id 
            ORDER BY sort_order ASC
        ");
        $stmt->execute(['product_id' => $productId]);
        return $stmt->fetchAll();
    }

    public function getAllProductsAdmin(): array {
        $sql = "
            SELECT p.*, c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.id DESC
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $products = $stmt->fetchAll();
        foreach ($products as &$product) {
            $product['images'] = $this->getProductImages($product['id']);
            
            $variantStmt = $this->db->prepare("
                SELECT id, size, color, stock, sku 
                FROM product_variants 
                WHERE product_id = :product_id 
                ORDER BY FIELD(size, 'S', 'M', 'L', 'XL', 'OS')
            ");
            $variantStmt->execute(['product_id' => $product['id']]);
            $product['variants'] = $variantStmt->fetchAll();
        }
        return $products;
    }

    public function createProductDb(array $data, array $variants, array $images): int {
        $this->db->beginTransaction();
        try {
            $stmt = $this->db->prepare("
                INSERT INTO products (category_id, name, slug, description, price, sale_price, is_new, is_sale, status)
                VALUES (:category_id, :name, :slug, :description, :price, :sale_price, :is_new, :is_sale, :status)
            ");
            $stmt->execute([
                'category_id' => $data['category_id'] ?: null,
                'name' => $data['name'],
                'slug' => $data['slug'],
                'description' => $data['description'] ?? null,
                'price' => $data['price'],
                'sale_price' => $data['sale_price'] ?: null,
                'is_new' => $data['is_new'] ? 1 : 0,
                'is_sale' => $data['is_sale'] ? 1 : 0,
                'status' => $data['status'] ?? 'active'
            ]);
            $productId = (int)$this->db->lastInsertId();

            $vStmt = $this->db->prepare("
                INSERT INTO product_variants (product_id, size, color, stock, sku)
                VALUES (:product_id, :size, :color, :stock, :sku)
            ");
            foreach ($variants as $v) {
                if (empty($v['size'])) continue;
                $vStmt->execute([
                    'product_id' => $productId,
                    'size' => $v['size'],
                    'color' => $v['color'] ?? null,
                    'stock' => (int)($v['stock'] ?? 0),
                    'sku' => $v['sku'] ?: ('SKU-' . $productId . '-' . $v['size'] . '-' . rand(100, 999))
                ]);
            }

            $imgStmt = $this->db->prepare("
                INSERT INTO product_images (product_id, image_url, sort_order, is_hover_alternate)
                VALUES (:product_id, :image_url, :sort_order, :is_hover_alternate)
            ");
            foreach ($images as $idx => $imgUrl) {
                if (empty($imgUrl)) continue;
                $imgStmt->execute([
                    'product_id' => $productId,
                    'image_url' => $imgUrl,
                    'sort_order' => $idx,
                    'is_hover_alternate' => $idx === 1 ? 1 : 0
                ]);
            }

            $this->db->commit();
            return $productId;
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function updateProductDb(int $productId, array $data, array $variants, array $images): bool {
        $this->db->beginTransaction();
        try {
            $stmt = $this->db->prepare("
                UPDATE products 
                SET category_id = :category_id, name = :name, slug = :slug, description = :description, 
                    price = :price, sale_price = :sale_price, is_new = :is_new, is_sale = :is_sale, status = :status
                WHERE id = :id
            ");
            $stmt->execute([
                'category_id' => $data['category_id'] ?: null,
                'name' => $data['name'],
                'slug' => $data['slug'],
                'description' => $data['description'] ?? null,
                'price' => $data['price'],
                'sale_price' => $data['sale_price'] ?: null,
                'is_new' => $data['is_new'] ? 1 : 0,
                'is_sale' => $data['is_sale'] ? 1 : 0,
                'status' => $data['status'] ?? 'active',
                'id' => $productId
            ]);

            // Sync variants
            $delV = $this->db->prepare("DELETE FROM product_variants WHERE product_id = :product_id");
            $delV->execute(['product_id' => $productId]);

            $vStmt = $this->db->prepare("
                INSERT INTO product_variants (product_id, size, color, stock, sku)
                VALUES (:product_id, :size, :color, :stock, :sku)
            ");
            foreach ($variants as $v) {
                if (empty($v['size'])) continue;
                $vStmt->execute([
                    'product_id' => $productId,
                    'size' => $v['size'],
                    'color' => $v['color'] ?? null,
                    'stock' => (int)($v['stock'] ?? 0),
                    'sku' => $v['sku'] ?: ('SKU-' . $productId . '-' . $v['size'] . '-' . rand(100, 999))
                ]);
            }

            // Sync images
            $delImg = $this->db->prepare("DELETE FROM product_images WHERE product_id = :product_id");
            $delImg->execute(['product_id' => $productId]);

            $imgStmt = $this->db->prepare("
                INSERT INTO product_images (product_id, image_url, sort_order, is_hover_alternate)
                VALUES (:product_id, :image_url, :sort_order, :is_hover_alternate)
            ");
            foreach ($images as $idx => $imgUrl) {
                if (empty($imgUrl)) continue;
                $imgStmt->execute([
                    'product_id' => $productId,
                    'image_url' => $imgUrl,
                    'sort_order' => $idx,
                    'is_hover_alternate' => $idx === 1 ? 1 : 0
                ]);
            }

            $this->db->commit();
            return true;
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function deleteProductDb(int $productId): bool {
        $this->db->beginTransaction();
        try {
            $delV = $this->db->prepare("DELETE FROM product_variants WHERE product_id = :product_id");
            $delV->execute(['product_id' => $productId]);

            $delImg = $this->db->prepare("DELETE FROM product_images WHERE product_id = :product_id");
            $delImg->execute(['product_id' => $productId]);

            $stmt = $this->db->prepare("DELETE FROM products WHERE id = :id");
            $result = $stmt->execute(['id' => $productId]);
            
            $this->db->commit();
            return $result;
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function createCategoryDb(string $name, string $slug, ?string $description, ?int $parentId): int {
        $stmt = $this->db->prepare("
            INSERT INTO categories (name, slug, description, parent_id)
            VALUES (:name, :slug, :description, :parent_id)
        ");
        $stmt->execute([
            'name' => $name,
            'slug' => $slug,
            'description' => $description,
            'parent_id' => $parentId ?: null
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function updateCategoryDb(int $id, string $name, string $slug, ?string $description, ?int $parentId): bool {
        $stmt = $this->db->prepare("
            UPDATE categories
            SET name = :name, slug = :slug, description = :description, parent_id = :parent_id
            WHERE id = :id
        ");
        return $stmt->execute([
            'name' => $name,
            'slug' => $slug,
            'description' => $description,
            'parent_id' => $parentId ?: null,
            'id' => $id
        ]);
    }

    public function deleteCategoryDb(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM categories WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
