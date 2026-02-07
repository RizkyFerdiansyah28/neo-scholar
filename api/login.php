<?php
// api/login.php
include_once 'config/database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->email) || !isset($data->password)) {
        http_response_code(400);
        echo json_encode(["message" => "Email dan password diperlukan"]);
        exit();
    }

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$data->email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // CATATAN: Untuk testing awal dengan data dummy SQL sebelumnya (yang passwordnya plain text 'hashed_password'), 
    // kita pakai perbandingan string biasa dulu.
    // Jika nanti user register lewat aplikasi, gunakan: password_verify($data->password, $user['password'])
    
    if ($user && $data->password === "123456") { // Ganti logika ini sesuai kebutuhan keamanan nanti
        // Hapus password dari respons
        unset($user['password']);
        
        echo json_encode([
            "message" => "Login berhasil",
            "user" => $user
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["message" => "Email atau password salah"]);
    }
}
?>