<?php
// api/courses.php
include_once 'config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? $_GET['id'] : null;

switch ($method) {
    case 'GET':
        $stmt = $conn->query("SELECT * FROM courses ORDER BY id DESC");
        $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($courses);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        $sql = "INSERT INTO courses (title, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        
        // Set default image jika kosong
        $image = !empty($data->image) ? $data->image : '/images/products/Animasi2d.jpeg';
        
        if($stmt->execute([$data->title, $data->description, $data->price, $data->category, $image])) {
            echo json_encode(["message" => "Course created"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed"]);
        }
        break;

    case 'PUT':
        if (!$id) exit(json_encode(["message" => "ID required"]));
        $data = json_decode(file_get_contents("php://input"));
        
        $sql = "UPDATE courses SET title=?, description=?, price=?, category=?, image_url=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        
        if($stmt->execute([$data->title, $data->description, $data->price, $data->category, $data->image, $id])) {
            echo json_encode(["message" => "Course updated"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed"]);
        }
        break;

    case 'DELETE':
        if (!$id) exit(json_encode(["message" => "ID required"]));
        $stmt = $conn->prepare("DELETE FROM courses WHERE id = ?");
        if($stmt->execute([$id])) {
            echo json_encode(["message" => "Deleted"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed"]);
        }
        break;
}
?>