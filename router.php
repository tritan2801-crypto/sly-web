<?php
/**
 * PHP Built-in Web Server Router Script
 * Bypasses Windows path-with-spaces bug by directly requiring PHP scripts.
 */
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Redirect root to frontend entrypoint to support clean SPA loading
if ($uri === '/' || $uri === '') {
    header('Location: /frontend/index.html');
    exit;
}

$file = __DIR__ . $uri;

// Check if the file exists and is not a directory
if (file_exists($file) && !is_dir($file)) {
    // If it's a PHP file, require it directly to bypass the built-in server space bug on Windows
    if (pathinfo($file, PATHINFO_EXTENSION) === 'php') {
        require_once $file;
        exit;
    }
    return false; // Serve other static assets (HTML, CSS, JS, images) directly
}

// Route all other paths (API routes) to the entrypoint
require_once __DIR__ . '/backend/public/index.php';
