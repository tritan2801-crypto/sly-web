<?php
namespace Controllers;

use Models\Product;

class ProductController {
    private Product $model;

    public function __construct() {
        $this->model = new Product();
    }

    public function getCategories() {
        try {
            $categories = $this->model->getCategories();
            echo json_encode([
                'success' => true,
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function getProducts() {
        try {
            $categoryId = isset($_GET['category_id']) && $_GET['category_id'] !== '' ? (int)$_GET['category_id'] : null;
            $search = $_GET['search'] ?? null;
            $sort = $_GET['sort'] ?? null;
            $minPrice = isset($_GET['min_price']) && $_GET['min_price'] !== '' ? (float)$_GET['min_price'] : null;
            $maxPrice = isset($_GET['max_price']) && $_GET['max_price'] !== '' ? (float)$_GET['max_price'] : null;
            $size = $_GET['size'] ?? null;
            $categoryGroup = $_GET['category_group'] ?? null;
            $page = isset($_GET['page']) && $_GET['page'] !== '' ? (int)$_GET['page'] : null;
            $limit = isset($_GET['limit']) && $_GET['limit'] !== '' ? (int)$_GET['limit'] : 9;

            $result = $this->model->getProducts($categoryId, $search, $sort, $minPrice, $maxPrice, $size, $categoryGroup, $page, $limit);

            if ($page !== null) {
                echo json_encode([
                    'success' => true,
                    'data' => $result['products'],
                    'pagination' => [
                        'total' => $result['total'],
                        'page' => $page,
                        'limit' => $limit,
                        'total_pages' => (int)ceil($result['total'] / $limit)
                    ]
                ]);
            } else {
                echo json_encode([
                    'success' => true,
                    'data' => $result
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

    public function getProductDetail() {
        try {
            $slugOrId = $_GET['slug'] ?? $_GET['id'] ?? null;

            if (empty($slugOrId)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Product identifier (id or slug) is required.'
                ]);
                return;
            }

            $product = $this->model->getProductDetail($slugOrId);

            if (!$product) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Product not found.'
                ]);
                return;
            }

            echo json_encode([
                'success' => true,
                'data' => $product
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function getAdminProducts() {
        if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Forbidden. Admin privileges required.']);
            return;
        }
        try {
            $products = $this->model->getAllProductsAdmin();
            echo json_encode(['success' => true, 'data' => $products]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    public function createProduct(array $data) {
        if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Forbidden. Admin privileges required.']);
            return;
        }
        $name = trim($data['name'] ?? '');
        $price = (float)($data['price'] ?? 0);
        $variants = $data['variants'] ?? [];
        $images = $data['images'] ?? [];

        if (empty($name) || $price <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Product name and positive price are required.']);
            return;
        }

        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
        $slugCheck = $slug;
        $counter = 1;
        while ($this->model->getProductDetail($slugCheck) !== null) {
            $slugCheck = $slug . '-' . $counter;
            $counter++;
        }
        $slug = $slugCheck;

        $productData = [
            'category_id' => $data['category_id'] ?? null,
            'name' => $name,
            'slug' => $slug,
            'description' => trim($data['description'] ?? ''),
            'price' => $price,
            'sale_price' => isset($data['sale_price']) && $data['sale_price'] !== '' ? (float)$data['sale_price'] : null,
            'is_new' => !empty($data['is_new']),
            'is_sale' => !empty($data['is_sale']),
            'status' => $data['status'] ?? 'active'
        ];

        try {
            $productId = $this->model->createProductDb($productData, $variants, $images);
            echo json_encode(['success' => true, 'message' => 'Product created successfully.', 'id' => $productId]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    public function updateProduct(array $data) {
        if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Forbidden. Admin privileges required.']);
            return;
        }
        $productId = (int)($data['id'] ?? 0);
        $name = trim($data['name'] ?? '');
        $price = (float)($data['price'] ?? 0);
        $variants = $data['variants'] ?? [];
        $images = $data['images'] ?? [];

        if ($productId <= 0 || empty($name) || $price <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Valid ID, product name and positive price are required.']);
            return;
        }

        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
        $slugCheck = $slug;
        $counter = 1;
        while (true) {
            $existing = $this->model->getProductDetail($slugCheck);
            if ($existing !== null && (int)$existing['id'] !== $productId) {
                $slugCheck = $slug . '-' . $counter;
                $counter++;
            } else {
                break;
            }
        }
        $slug = $slugCheck;

        $productData = [
            'category_id' => $data['category_id'] ?? null,
            'name' => $name,
            'slug' => $slug,
            'description' => trim($data['description'] ?? ''),
            'price' => $price,
            'sale_price' => isset($data['sale_price']) && $data['sale_price'] !== '' ? (float)$data['sale_price'] : null,
            'is_new' => !empty($data['is_new']),
            'is_sale' => !empty($data['is_sale']),
            'status' => $data['status'] ?? 'active'
        ];

        try {
            $this->model->updateProductDb($productId, $productData, $variants, $images);
            echo json_encode(['success' => true, 'message' => 'Product updated successfully.']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    public function deleteProduct(array $data) {
        if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Forbidden. Admin privileges required.']);
            return;
        }
        $productId = (int)($data['id'] ?? 0);
        if ($productId <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Valid product ID is required.']);
            return;
        }
        try {
            $this->model->deleteProductDb($productId);
            echo json_encode(['success' => true, 'message' => 'Product deleted successfully.']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    public function createCategory(array $data) {
        if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Forbidden. Admin privileges required.']);
            return;
        }
        $name = trim($data['name'] ?? '');
        $description = trim($data['description'] ?? '');
        $parentId = isset($data['parent_id']) && $data['parent_id'] !== '' ? (int)$data['parent_id'] : null;

        if (empty($name)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Category name is required.']);
            return;
        }

        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));

        try {
            $catId = $this->model->createCategoryDb($name, $slug, $description, $parentId);
            echo json_encode(['success' => true, 'message' => 'Category created successfully.', 'id' => $catId]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    public function updateCategory(array $data) {
        if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Forbidden. Admin privileges required.']);
            return;
        }
        $id = (int)($data['id'] ?? 0);
        $name = trim($data['name'] ?? '');
        $description = trim($data['description'] ?? '');
        $parentId = isset($data['parent_id']) && $data['parent_id'] !== '' ? (int)$data['parent_id'] : null;

        if ($id <= 0 || empty($name)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Category ID and name are required.']);
            return;
        }

        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));

        try {
            $this->model->updateCategoryDb($id, $name, $slug, $description, $parentId);
            echo json_encode(['success' => true, 'message' => 'Category updated successfully.']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    public function deleteCategory(array $data) {
        if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Forbidden. Admin privileges required.']);
            return;
        }
        $id = (int)($data['id'] ?? 0);
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Valid category ID is required.']);
            return;
        }
        try {
            $this->model->deleteCategoryDb($id);
            echo json_encode(['success' => true, 'message' => 'Category deleted successfully.']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }
}
