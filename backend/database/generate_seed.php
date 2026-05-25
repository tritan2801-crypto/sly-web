<?php
/**
 * Programmatic SQL Seed Generator for SLY CLOTHING
 * Sourced with streetwear-themed Pexels image assets.
 * Seeds 11 subcategories and at least 10 products per subcategory (110 products total).
 */

$categories = [
    // Tops
    11 => ['parent' => 10, 'slug' => 'tee', 'name' => 'T-Shirt', 'desc' => 'Áo thun oversized, graphic tee chất lượng cao.'],
    12 => ['parent' => 10, 'slug' => 'polo', 'name' => 'Polo', 'desc' => 'Áo polo cổ bẻ phom rộng lịch sự, phong cách đường phố.'],
    13 => ['parent' => 10, 'slug' => 'shirt', 'name' => 'Shirt', 'desc' => 'Áo sơ mi streetwear, sơ mi flannel hoạ tiết cá tính.'],
    // Outwears
    21 => ['parent' => 20, 'slug' => 'hoodie', 'name' => 'Hoodie', 'desc' => 'Áo hoodie nỉ bông ấm áp, thoải mái.'],
    22 => ['parent' => 20, 'slug' => 'jacket', 'name' => 'Jacket', 'desc' => 'Áo khoác dù bomber, varsity jacket phong trần.'],
    23 => ['parent' => 20, 'slug' => 'sweater', 'name' => 'Sweater', 'desc' => 'Áo nỉ sweater cổ tròn, phom rộng basic.'],
    // Bottoms
    31 => ['parent' => 30, 'slug' => 'short', 'name' => 'Short', 'desc' => 'Quần đùi, quần short nỉ, quần short túi hộp năng động.'],
    32 => ['parent' => 30, 'slug' => 'pant', 'name' => 'Pant', 'desc' => 'Quần dài cargo pants, quần jean ống rộng, sweatpants.'],
    // Accessories
    41 => ['parent' => 40, 'slug' => 'wallet', 'name' => 'Wallet', 'desc' => 'Ví da mini, ví dù gập gọn phong cách streetwear.'],
    42 => ['parent' => 40, 'slug' => 'cap', 'name' => 'Cap', 'desc' => 'Mũ lưỡi trai, mũ bucket hat thêu logo sắc nét.'],
    43 => ['parent' => 40, 'slug' => 'backpacks', 'name' => 'Backpacks', 'desc' => 'Balo canvas, balo dù chống nước đa chức năng.']
];

$categoryParents = [
    10 => ['name' => 'Tops', 'slug' => 'tops', 'desc' => 'Áo thun, áo polo, áo sơ mi phom rộng.'],
    20 => ['name' => 'Outwears', 'slug' => 'outwears', 'desc' => 'Áo khoác, hoodie, sweater nỉ đường phố.'],
    30 => ['name' => 'Bottoms', 'slug' => 'bottoms', 'desc' => 'Quần ngắn, quần dài phom dáng thoải mái.'],
    40 => ['name' => 'Accessories', 'slug' => 'accessories', 'desc' => 'Phụ kiện mũ, ví, balo thời trang.']
];

// Product configuration generators
$subcategoriesProducts = [
    // Tops - Tee (11)
    11 => [
        ['name' => 'SLY Classic Logo Tee', 'price' => 350000, 'sale' => null, 'img' => [1656684, 1656681]],
        ['name' => 'SLY Outline Graphic Tee', 'price' => 380000, 'sale' => 299000, 'img' => [1018911, 1656684]],
        ['name' => 'SLY Oversized Boxy Tee', 'price' => 390000, 'sale' => null, 'img' => [2294342, 1018911]],
        ['name' => 'SLY Cyberpunk Print Tee', 'price' => 420000, 'sale' => 350000, 'img' => [8532615, 2294342]],
        ['name' => 'SLY Minimalist Pocket Tee', 'price' => 320000, 'sale' => null, 'img' => [991509, 8532615]],
        ['name' => 'SLY Street Culture Tee', 'price' => 360000, 'sale' => 270000, 'img' => [2869076, 991509]],
        ['name' => 'SLY Acid Wash Vintage Tee', 'price' => 450000, 'sale' => null, 'img' => [3613009, 2869076]],
        ['name' => 'SLY Typography Heavy Tee', 'price' => 370000, 'sale' => null, 'img' => [5709656, 3613009]],
        ['name' => 'SLY Retro Collage Tee', 'price' => 400000, 'sale' => 310000, 'img' => [935985, 5709656]],
        ['name' => 'SLY Reflective Signature Tee', 'price' => 430000, 'sale' => null, 'img' => [428338, 935985]]
    ],
    // Tops - Polo (12)
    12 => [
        ['name' => 'SLY Urban Zip Polo', 'price' => 380000, 'sale' => null, 'img' => [1435677, 2220315]],
        ['name' => 'SLY Retro Striped Polo', 'price' => 420000, 'sale' => 320000, 'img' => [1232459, 1435677]],
        ['name' => 'SLY Basic Knit Polo', 'price' => 390000, 'sale' => null, 'img' => [297933, 1232459]],
        ['name' => 'SLY Heavy Cotton Polo', 'price' => 450000, 'sale' => 380000, 'img' => [4505458, 297933]],
        ['name' => 'SLY Contrast Collar Polo', 'price' => 410000, 'sale' => null, 'img' => [5325840, 4505458]],
        ['name' => 'SLY Streetwear Polo Sport', 'price' => 430000, 'sale' => null, 'img' => [6311394, 5325840]],
        ['name' => 'SLY Cozy Oversized Polo', 'price' => 480000, 'sale' => 390000, 'img' => [3812433, 6311394]],
        ['name' => 'SLY Acid Wash Polo', 'price' => 470000, 'sale' => null, 'img' => [5325885, 3812433]],
        ['name' => 'SLY Cargo Pocket Polo', 'price' => 440000, 'sale' => null, 'img' => [428340, 5325885]],
        ['name' => 'SLY Embroidered Crest Polo', 'price' => 460000, 'sale' => 350000, 'img' => [2220315, 428340]]
    ],
    // Tops - Shirt (13)
    13 => [
        ['name' => 'SLY Classic Flannel Shirt', 'price' => 450000, 'sale' => null, 'img' => [297933, 374044]],
        ['name' => 'SLY Street Utility Shirt', 'price' => 490000, 'sale' => 399000, 'img' => [1043474, 297933]],
        ['name' => 'SLY Oversized Bowling Shirt', 'price' => 420000, 'sale' => null, 'img' => [1311590, 1043474]],
        ['name' => 'SLY Cargo Pocket Workshirt', 'price' => 520000, 'sale' => 450000, 'img' => [2079164, 1311590]],
        ['name' => 'SLY Distressed Denim Shirt', 'price' => 550000, 'sale' => null, 'img' => [325688, 2079164]],
        ['name' => 'SLY Stripe Loose Fit Shirt', 'price' => 440000, 'sale' => null, 'img' => [1043471, 325688]],
        ['name' => 'SLY Paisley Print Street Shirt', 'price' => 470000, 'sale' => 380000, 'img' => [3805983, 1043471]],
        ['name' => 'SLY Techwear Buckle Shirt', 'price' => 580000, 'sale' => null, 'img' => [1103828, 3805983]],
        ['name' => 'SLY Corduroy Overshirt', 'price' => 560000, 'sale' => 480000, 'img' => [2294343, 1103828]],
        ['name' => 'SLY Minimalist Collarless Shirt', 'price' => 410000, 'sale' => null, 'img' => [374044, 2294343]]
    ],
    // Outwears - Hoodie (21)
    21 => [
        ['name' => 'SLY Heavy Fleece Hoodie', 'price' => 650000, 'sale' => 499000, 'img' => [1183266, 1183261]],
        ['name' => 'SLY Cyber Skull Hoodie', 'price' => 690000, 'sale' => null, 'img' => [1009904, 1183266]],
        ['name' => 'SLY Oversized Neon Hoodie', 'price' => 620000, 'sale' => 450000, 'img' => [1820686, 1009904]],
        ['name' => 'SLY Acid Wash Boxy Hoodie', 'price' => 720000, 'sale' => null, 'img' => [2061901, 1820686]],
        ['name' => 'SLY Distressed Edge Hoodie', 'price' => 680000, 'sale' => 520000, 'img' => [2235071, 2061901]],
        ['name' => 'SLY Utility Pocket Hoodie', 'price' => 750000, 'sale' => null, 'img' => [2897531, 2235071]],
        ['name' => 'SLY Velvet Street Hoodie', 'price' => 780000, 'sale' => 610000, 'img' => [1183262, 2897531]],
        ['name' => 'SLY Signature Kanji Hoodie', 'price' => 670000, 'sale' => null, 'img' => [839011, 1183262]],
        ['name' => 'SLY Tech Half-Zip Hoodie', 'price' => 790000, 'sale' => 650000, 'img' => [1450116, 839011]],
        ['name' => 'SLY Thermal Waffle Hoodie', 'price' => 600000, 'sale' => null, 'img' => [1183261, 1450116]]
    ],
    // Outwears - Jacket (22)
    22 => [
        ['name' => 'SLY Techwear Utility Jacket', 'price' => 850000, 'sale' => 750000, 'img' => [1619806, 1619809]],
        ['name' => 'SLY Street Denim Varsity', 'price' => 890000, 'sale' => null, 'img' => [1619802, 1619806]],
        ['name' => 'SLY Retro Colorblock Bomber', 'price' => 790000, 'sale' => 620000, 'img' => [9834887, 1619802]],
        ['name' => 'SLY Premium Leather Biker', 'price' => 1250000, 'sale' => 990000, 'img' => [769749, 9834887]],
        ['name' => 'SLY Waterproof Windbreaker', 'price' => 720000, 'sale' => null, 'img' => [1516680, 769749]],
        ['name' => 'SLY MA-1 Flight Jacket', 'price' => 880000, 'sale' => 699000, 'img' => [1619801, 1516680]],
        ['name' => 'SLY Tactical Cargo Anorak', 'price' => 820000, 'sale' => null, 'img' => [1036622, 1619801]],
        ['name' => 'SLY Heavy Puffer Jacket', 'price' => 980000, 'sale' => 850000, 'img' => [1526814, 1036622]],
        ['name' => 'SLY Sherpa Fleece Coach', 'price' => 760000, 'sale' => null, 'img' => [1759622, 1526814]],
        ['name' => 'SLY Corduroy Trucker Jacket', 'price' => 810000, 'sale' => 680000, 'img' => [1619809, 1759622]]
    ],
    // Outwears - Sweater (23)
    23 => [
        ['name' => 'SLY Oversized knit Sweater', 'price' => 580000, 'sale' => 450000, 'img' => [1183258, 5932727]],
        ['name' => 'SLY Distressed Crewneck Sweater', 'price' => 620000, 'sale' => null, 'img' => [5932727, 1183258]],
        ['name' => 'SLY Retro Jacquard Sweater', 'price' => 650000, 'sale' => 499000, 'img' => [3822844, 5932727]],
        ['name' => 'SLY Cable Knit Mockneck', 'price' => 680000, 'sale' => null, 'img' => [5709661, 3822844]],
        ['name' => 'SLY Vintage Chenille Sweater', 'price' => 640000, 'sale' => 530000, 'img' => [2220316, 5709661]],
        ['name' => 'SLY Striped grunge sweater', 'price' => 590000, 'sale' => null, 'img' => [2929990, 2220316]],
        ['name' => 'SLY Mohair blend Sweater', 'price' => 750000, 'sale' => 620000, 'img' => [6083834, 2929990]],
        ['name' => 'SLY College V-Neck Sweater', 'price' => 570000, 'sale' => null, 'img' => [5709668, 6083834]],
        ['name' => 'SLY Zip-Up Heavy Cardigan', 'price' => 720000, 'sale' => 590000, 'img' => [6311687, 5709668]],
        ['name' => 'SLY Minimalist Cotton Sweater', 'price' => 550000, 'sale' => null, 'img' => [8485731, 6311687]]
    ],
    // Bottoms - Short (31)
    31 => [
        ['name' => 'SLY Denim Street Shorts', 'price' => 380000, 'sale' => 290000, 'img' => [2885913, 2885914]],
        ['name' => 'SLY Tactical Cargo Shorts', 'price' => 420000, 'sale' => null, 'img' => [5946124, 2885913]],
        ['name' => 'SLY Heavy Sweat Shorts', 'price' => 350000, 'sale' => 280000, 'img' => [3657429, 5946124]],
        ['name' => 'SLY Utility Webbing Shorts', 'price' => 450000, 'sale' => null, 'img' => [5946152, 3657429]],
        ['name' => 'SLY Wide Skate Shorts', 'price' => 390000, 'sale' => 310000, 'img' => [2885902, 5946152]],
        ['name' => 'SLY Mesh Athletic Shorts', 'price' => 320000, 'sale' => null, 'img' => [2885914, 2885902]],
        ['name' => 'SLY Acid Wash Sweat Shorts', 'price' => 400000, 'sale' => 320000, 'img' => [5946150, 2885914]],
        ['name' => 'SLY Vintage Workwear Shorts', 'price' => 430000, 'sale' => null, 'img' => [2885901, 5946150]],
        ['name' => 'SLY Lightweight Nylon Shorts', 'price' => 360000, 'sale' => null, 'img' => [6311545, 2885901]],
        ['name' => 'SLY Drawstring Chino Shorts', 'price' => 370000, 'sale' => 299000, 'img' => [3657425, 6311545]]
    ],
    // Bottoms - Pant (32)
    32 => [
        ['name' => 'SLY Tactical Cargo Pants', 'price' => 500000, 'sale' => null, 'img' => [1598500, 1598501]],
        ['name' => 'SLY Baggy Denim Jeans', 'price' => 550000, 'sale' => 450000, 'img' => [1598505, 1598500]],
        ['name' => 'SLY Heavy-weight Sweatpants', 'price' => 480000, 'sale' => null, 'img' => [1009000, 1598505]],
        ['name' => 'SLY Wide-Leg Utility Trousers', 'price' => 520000, 'sale' => 420000, 'img' => [1346187, 1009000]],
        ['name' => 'SLY Parachute Tech Pants', 'price' => 580000, 'sale' => null, 'img' => [4255627, 1346187]],
        ['name' => 'SLY Distressed Ripped Jeans', 'price' => 620000, 'sale' => 499000, 'img' => [2869075, 4255627]],
        ['name' => 'SLY Patchwork Skate Jeans', 'price' => 650000, 'sale' => null, 'img' => [3119215, 2869075]],
        ['name' => 'SLY Cargo Track Pants', 'price' => 490000, 'sale' => 390000, 'img' => [6311542, 3119215]],
        ['name' => 'SLY Carpenter Canvas Pants', 'price' => 560000, 'sale' => null, 'img' => [1598508, 6311542]],
        ['name' => 'SLY Classic Straight Chinos', 'price' => 460000, 'sale' => 370000, 'img' => [1598501, 1598508]]
    ],
    // Accessories - Wallet (41)
    41 => [
        ['name' => 'SLY Leather Cardholder Wallet', 'price' => 250000, 'sale' => 190000, 'img' => [9153428, 9153427]],
        ['name' => 'SLY Minimalist Metal Wallet', 'price' => 350000, 'sale' => null, 'img' => [9153434, 9153428]],
        ['name' => 'SLY Classic Bifold Wallet', 'price' => 290000, 'sale' => null, 'img' => [9153431, 9153434]],
        ['name' => 'SLY Vintage Oil Leather Wallet', 'price' => 390000, 'sale' => 320000, 'img' => [9153429, 9153431]],
        ['name' => 'SLY Compact Canvas Wallet', 'price' => 180000, 'sale' => null, 'img' => [9153430, 9153429]],
        ['name' => 'SLY Street Lanyard Wallet', 'price' => 220000, 'sale' => 160000, 'img' => [9153437, 9153430]],
        ['name' => 'SLY Suede Zip Cardholder', 'price' => 270000, 'sale' => null, 'img' => [9153427, 9153437]],
        ['name' => 'SLY Trifold Utility Wallet', 'price' => 320000, 'sale' => 250000, 'img' => [9153435, 9153427]],
        ['name' => 'SLY Tactical Cordura Wallet', 'price' => 280000, 'sale' => null, 'img' => [9153438, 9153435]],
        ['name' => 'SLY Iron Chain Street Wallet', 'price' => 360000, 'sale' => 290000, 'img' => [9153439, 9153438]]
    ],
    // Accessories - Cap (42)
    42 => [
        ['name' => 'SLY Signature Streetwear Cap', 'price' => 180000, 'sale' => null, 'img' => [1078958, 1485031]],
        ['name' => 'SLY Classic Snapback Cap', 'price' => 220000, 'sale' => 165000, 'img' => [844864, 1078958]],
        ['name' => 'SLY Streetwear Knit Beanie', 'price' => 190000, 'sale' => null, 'img' => [3582102, 844864]],
        ['name' => 'SLY Utility Bucket Hat', 'price' => 250000, 'sale' => 199000, 'img' => [1858175, 3582102]],
        ['name' => 'SLY Acid Wash Dad Hat', 'price' => 210000, 'sale' => null, 'img' => [1078955, 1858175]],
        ['name' => 'SLY Reflective Beanie Hat', 'price' => 230000, 'sale' => null, 'img' => [1078956, 1078955]],
        ['name' => 'SLY Corduroy Vintage Cap', 'price' => 240000, 'sale' => 180000, 'img' => [1124466, 1078956]],
        ['name' => 'SLY Distressed Strapback Cap', 'price' => 200000, 'sale' => null, 'img' => [1078954, 1124466]],
        ['name' => 'SLY Camo Outdoor Bucket', 'price' => 270000, 'sale' => 210000, 'img' => [1078953, 1078954]],
        ['name' => 'SLY Embroidered Street Cap', 'price' => 215000, 'sale' => null, 'img' => [1485031, 1078953]]
    ],
    // Accessories - Backpacks (43)
    43 => [
        ['name' => 'SLY Cordura Utility Backpack', 'price' => 450000, 'sale' => 390000, 'img' => [1294659, 1294665]],
        ['name' => 'SLY Minimalist Daily Backpack', 'price' => 390000, 'sale' => null, 'img' => [1294656, 1294659]],
        ['name' => 'SLY Tactical Commuter Pack', 'price' => 520000, 'sale' => 420000, 'img' => [1294671, 1294656]],
        ['name' => 'SLY Roll-top Canvas Backpack', 'price' => 480000, 'sale' => null, 'img' => [1294672, 1294671]],
        ['name' => 'SLY Waterproof Tech Backpack', 'price' => 580000, 'sale' => 499000, 'img' => [1294657, 1294672]],
        ['name' => 'SLY Denim Multi-pocket Pack', 'price' => 460000, 'sale' => null, 'img' => [1294668, 1294657]],
        ['name' => 'SLY Active Urban Sling Pack', 'price' => 350000, 'sale' => 280000, 'img' => [1294669, 1294668]],
        ['name' => 'SLY Heavy Duty Duffel Backpack', 'price' => 620000, 'sale' => null, 'img' => [1294674, 1294669]],
        ['name' => 'SLY Reflective Safety Backpack', 'price' => 490000, 'sale' => 390000, 'img' => [1294667, 1294674]],
        ['name' => 'SLY Retro Student Backpack', 'price' => 410000, 'sale' => null, 'img' => [1294665, 1294667]]
    ]
];

$sql = "-- SLY CLOTHING Autogenerated Seed Data (110 Streetwear Products)
-- Aligned with Design System & Visual Style tokens
-- Database: sly_clothing

USE `sly_clothing`;

-- Enable multiple statements
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `order_items`;
TRUNCATE TABLE `orders`;
TRUNCATE TABLE `cart_items`;
TRUNCATE TABLE `product_variants`;
TRUNCATE TABLE `product_images`;
TRUNCATE TABLE `products`;
TRUNCATE TABLE `categories`;
TRUNCATE TABLE `customer_loyalty`;
TRUNCATE TABLE `user_roles`;
TRUNCATE TABLE `users`;
TRUNCATE TABLE `role_permissions`;
TRUNCATE TABLE `permissions`;
TRUNCATE TABLE `roles`;
SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- 1. ACCESS CONTROL & RBAC/RPAC TABLES
-- ==========================================
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'admin', 'System Administrator with full access rights'),
(2, 'staff', 'Staff Member to manage products and orders'),
(3, 'customer', 'Registered E-commerce Customer');

INSERT INTO `permissions` (`id`, `name`, `description`) VALUES
(1, 'manage_products', 'Create, update, and delete product catalog items'),
(2, 'manage_orders', 'View, update status, and manage customer orders'),
(3, 'view_analytics', 'View user behavior logs and business dashboards'),
(4, 'edit_users', 'Manage user accounts, roles, and status'),
(5, 'checkout', 'Place orders and manage personal cart items'),
(6, 'track_own_order', 'Track personal order history and current deliveries');

INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(2, 1), (2, 2), (2, 6),
(3, 5), (3, 6);

-- ==========================================
-- 2. SEED MEMBERSHIP TIERS
-- ==========================================
INSERT INTO `membership_tiers` (`id`, `name`, `min_points`, `discount_percentage`) VALUES
(1, 'Bronze', 0, 0.00),
(2, 'Silver', 1000, 5.00),
(3, 'Gold', 5000, 10.00),
(4, 'Platinum', 12000, 15.00);

-- ==========================================
-- 3. SEED USERS & LOYALTY RECORDS
-- ==========================================
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password_hash`, `status`) VALUES
(1, 'SLY Admin', 'admin@slyclothing.vn', '0901234567', '\$2y\$10\$qkdRs0Ne1NAO4yhuR3LtvOyZpmrNeF94AAuObouuqpXeCyDXhfOc6', 'active'),
(2, 'Nguyen Van A', 'customer1@gmail.com', '0987654321', '\$2y\$10\$PKFxENYEJIJQ5PKGcg851eIc8EUpoS6RkvaI2srACmdAox.lc8gZi', 'active');

INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(1, 1),
(2, 3);

INSERT INTO `customer_loyalty` (`user_id`, `current_points`, `lifetime_points`, `membership_tier_id`) VALUES
(2, 250, 250, 1);

-- ==========================================
-- 4. SEED CATEGORIES (Streetwear Sitemap)
-- ==========================================
-- Insert Parent categories
";

foreach ($categoryParents as $pId => $p) {
    $sql .= "INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `description`) VALUES ({$pId}, NULL, '{$p['name']}', '{$p['slug']}', '{$p['desc']}');\n";
}

// Insert Subcategories
$sql .= "\n-- Insert Subcategories\n";
foreach ($categories as $subId => $sub) {
    $sql .= "INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `description`) VALUES ({$subId}, {$sub['parent']}, '{$sub['name']}', '{$sub['slug']}', '{$sub['desc']}');\n";
}

// Generate products
$sql .= "\n-- ==========================================\n-- 5. SEED STREETWEAR PRODUCTS (110 Products)\n-- ==========================================\n";

$productId = 1;
$variantId = 1;
$imageInsertSql = "";
$variantInsertSql = "";

foreach ($subcategoriesProducts as $subCatId => $productsList) {
    $catInfo = $categories[$subCatId];
    $sql .= "\n-- Products for Subcategory: {$catInfo['name']}\n";
    foreach ($productsList as $pIdx => $prod) {
        $slug = $catInfo['slug'] . '-' . str_replace(' ', '-', strtolower(trim(str_replace('SLY ', '', $prod['name'])))) . '-' . ($pIdx + 1);
        $desc = "Sản phẩm nằm trong bộ sưu tập mới của SLY. Chất liệu cao cấp chuẩn streetwear phom rộng phong cách cá tính.";
        
        $salePriceVal = $prod['sale'] !== null ? $prod['sale'] . '.00' : "NULL";
        $isNew = ($pIdx % 3 == 0) ? 1 : 0;
        $isSale = $prod['sale'] !== null ? 1 : 0;

        $sql .= "INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `sale_price`, `is_new`, `is_sale`, `status`) VALUES ({$productId}, {$subCatId}, '{$prod['name']}', '{$slug}', '{$desc}', {$prod['price']}.00, {$salePriceVal}, {$isNew}, {$isSale}, 'active');\n";

        // Seed 2 images per product (Front and Hover alternate)
        $pexelsIdFront = $prod['img'][0];
        $pexelsIdBack = isset($prod['img'][1]) ? $prod['img'][1] : $prod['img'][0];

        $frontImgUrl = "https://images.pexels.com/photos/{$pexelsIdFront}/pexels-photo-{$pexelsIdFront}.jpeg?auto=compress&cs=tinysrgb&w=600";
        $backImgUrl = "https://images.pexels.com/photos/{$pexelsIdBack}/pexels-photo-{$pexelsIdBack}.jpeg?auto=compress&cs=tinysrgb&w=600";

        $imageInsertSql .= "INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`, `is_hover_alternate`) VALUES ({$productId}, '{$frontImgUrl}', 0, 0);\n";
        $imageInsertSql .= "INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`, `is_hover_alternate`) VALUES ({$productId}, '{$backImgUrl}', 1, 1);\n";

        // Seed variants
        // If accessories, seed single size OS. Else seed S, M, L, XL
        $sizes = ($subCatId >= 41 && $subCatId <= 43) ? ['OS'] : ['S', 'M', 'L', 'XL'];
        foreach ($sizes as $sz) {
            $sku = "SLY-" . strtoupper($catInfo['slug']) . "-" . $productId . "-" . $sz;
            $stock = rand(30, 150);
            $variantInsertSql .= "INSERT INTO `product_variants` (`id`, `product_id`, `size`, `color`, `stock`, `sku`) VALUES ({$variantId}, {$productId}, '{$sz}', 'Black', {$stock}, '{$sku}');\n";
            $variantId++;
        }

        $productId++;
    }
}

$sql .= "\n-- ==========================================\n-- 6. SEED PRODUCT IMAGES\n-- ==========================================\n" . $imageInsertSql;
$sql .= "\n-- ==========================================\n-- 7. SEED PRODUCT VARIANTS\n-- ==========================================\n" . $variantInsertSql;

// Seed Sample Order
// We will reference product variant ID 1 (which will be Tops - Tee - Product 1 - size S) and product variant ID 5 (Tops - Tee - Product 2 - size S)
$sql .= "
-- ==========================================
-- 8. SEED SAMPLE ORDER FOR ORDER TRACKING
-- ==========================================
INSERT INTO `orders` (`id`, `order_code`, `user_id`, `shipping_address`, `subtotal`, `discount`, `shipping_fee`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `tracking_number`) VALUES
(1, 'SLY-9827361', 2, '123 Nguyen Trai, Ward 2, District 5, Ho Chi Minh City', 730000.00, 0.00, 30000.00, 760000.00, 'COD', 'pending', 'processing', 'GHN-9988223');

INSERT INTO `order_items` (`order_id`, `product_variant_id`, `quantity`, `price`) VALUES
(1, 1, 1, 350000.00), -- Product 1 Size S
(1, 5, 1, 380000.00); -- Product 2 Size S
";

file_put_contents(__DIR__ . '/seed.sql', $sql);
echo "SQL seed file generated successfully: seed.sql\n";
