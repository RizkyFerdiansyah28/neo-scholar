<?php
// api/mentor_applications.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once 'config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

// Ambil user_id dari parameter URL (untuk filter)
$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;

switch ($method) {
    case 'GET':
        if ($user_id) {
            // Cek status pengajuan user tertentu (untuk Dashboard User)
            $stmt = $conn->prepare("SELECT * FROM mentor_applications WHERE user_id = ? ORDER BY id DESC LIMIT 1");
            $stmt->execute([$user_id]);
            $application = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($application ? $application : ["status" => "none"]);
        } else {
            // Ambil semua pengajuan pending (untuk Dashboard Admin)
            // Join dengan tabel users untuk dapat nama
            $sql = "SELECT ma.*, u.name, u.email 
                    FROM mentor_applications ma 
                    JOIN users u ON ma.user_id = u.id 
                    WHERE ma.status = 'pending' 
                    ORDER BY ma.created_at ASC";
            $stmt = $conn->query($sql);
            $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($applications);
        }
        break;

    case 'POST':
        // User mengajukan diri
        $data = json_decode(file_get_contents("php://input"));
        
        if (empty($data->user_id)) {
            http_response_code(400);
            echo json_encode(["message" => "User ID required"]);
            exit();
        }

        // Cek apakah sudah ada pengajuan pending
        $check = $conn->prepare("SELECT id FROM mentor_applications WHERE user_id = ? AND status = 'pending'");
        $check->execute([$data->user_id]);
        if ($check->rowCount() > 0) {
            echo json_encode(["message" => "Anda sudah memiliki pengajuan yang sedang diproses."]);
            exit();
        }

        $sql = "INSERT INTO mentor_applications (user_id, status) VALUES (?, 'pending')";
        $stmt = $conn->prepare($sql);
        
        if($stmt->execute([$data->user_id])) {
            echo json_encode(["message" => "Pengajuan berhasil dikirim."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Gagal mengirim pengajuan."]);
        }
        break;

    case 'PUT':
        // Admin menyetujui/menolak
        $data = json_decode(file_get_contents("php://input"));
        
        if (empty($data->id) || empty($data->status)) {
            http_response_code(400);
            echo json_encode(["message" => "ID dan Status required"]);
            exit();
        }

        try {
            $conn->beginTransaction();

            // 1. Update status aplikasi
            $stmt = $conn->prepare("UPDATE mentor_applications SET status = ? WHERE id = ?");
            $stmt->execute([$data->status, $data->id]);

            // 2. Jika approved, update role user jadi 'mentor'
            if ($data->status === 'approved') {
                // Ambil user_id dari aplikasi ini
                $getApp = $conn->prepare("SELECT user_id FROM mentor_applications WHERE id = ?");
                $getApp->execute([$data->id]);
                $row = $getApp->fetch(PDO::FETCH_ASSOC);

                if ($row) {
                    $updateUser = $conn->prepare("UPDATE users SET role = 'mentor' WHERE id = ?");
                    $updateUser->execute([$row['user_id']]);
                }
            }

            $conn->commit();
            echo json_encode(["message" => "Status berhasil diperbarui."]);

        } catch (Exception $e) {
            $conn->rollBack();
            http_response_code(500);
            echo json_encode(["message" => "Error: " . $e->getMessage()]);
        }
        break;
}
?>