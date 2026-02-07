<?php
// api/users.php
include_once 'config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

// Ambil ID dari URL jika ada (contoh: /users.php?id=1)
$id = isset($_GET['id']) ? $_GET['id'] : null;

switch ($method) {
    case 'GET':
        if ($id) {
            $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($user);
        } else {
            $stmt = $conn->query("SELECT * FROM users ORDER BY id DESC");
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($users);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        // Hash password default jika user baru dibuat admin
        $default_pass = password_hash("123456", PASSWORD_DEFAULT); 
        
        $sql = "INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        
        if($stmt->execute([$data->name, $data->email, $default_pass, $data->role, $data->status])) {
            echo json_encode(["message" => "User created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to create user"]);
        }
        break;

    case 'PUT':
        // Mengambil ID dari URL (users.php?id=1)
        if (!$id) {
            http_response_code(400);
            echo json_encode(["message" => "ID is required"]);
            exit();
        }
        
        $data = json_decode(file_get_contents("php://input"));
        
        $sql = "UPDATE users SET name=?, email=?, role=?, status=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        
        if($stmt->execute([$data->name, $data->email, $data->role, $data->status, $id])) {
            echo json_encode(["message" => "User updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update user"]);
        }
        break;

    case 'DELETE':
        if (!$id) {
            http_response_code(400);
            echo json_encode(["message" => "ID is required"]);
            exit();
        }

        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        if($stmt->execute([$id])) {
            echo json_encode(["message" => "User deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to delete user"]);
        }
        break;
}
?>