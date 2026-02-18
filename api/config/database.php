<?php
// api/config/database.php

// Pengaturan Header CORS (Pusatkan di sini)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Tangani preflight request dari browser
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Konfigurasi Database
$host = "localhost"; // Jika gagal, coba ganti dengan "127.0.0.1"
$db_name = "tes"; // Pastikan nama ini PERSIS sama dengan di phpMyAdmin
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    
    // PENTING: Aktifkan mode error exception agar masalah query terlihat
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $conn->exec("set names utf8");
} catch(PDOException $exception) {
    http_response_code(500); // Berikan kode error server
    echo json_encode([
        "success" => false,
        "message" => "Connection error: " . $exception->getMessage()
    ]);
    exit();
}
?>