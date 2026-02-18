<?php
// api/users.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");

include_once 'config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $role = isset($_GET['role']) ? $_GET['role'] : null;
    $id = isset($_GET['id']) ? $_GET['id'] : null; // <--- TAMBAHAN LOGIKA ID

    try {
        if ($id) {
            // === AMBIL SATU USER BERDASARKAN ID ===
            $sql = "SELECT id, username, email, role, created_at FROM users WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                // Tambahkan gambar dummy
                $user['image'] = '/assets/images/mentors/default_mentor.jpg';
                // Tambahkan bio dummy (karena belum ada di database)
                $user['bio'] = 'Seorang profesional yang berdedikasi tinggi dalam bidang pendidikan dan teknologi. Berpengalaman lebih dari 5 tahun membimbing siswa mencapai potensi terbaik mereka.';
                $user['expertise'] = 'Web Development, UI/UX';
                
                echo json_encode($user);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "User not found"]);
            }

        } elseif ($role) {
            // === AMBIL LIST BERDASARKAN ROLE ===
            $sql = "SELECT id, username, email, role, created_at FROM users WHERE role = ? ORDER BY id DESC";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$role]);
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($users as &$u) {
                $u['image'] = '/assets/images/mentors/default_mentor.jpg';
            }
            echo json_encode($users);

        } else {
            // === AMBIL SEMUA USER ===
            $sql = "SELECT id, username, email, role, created_at FROM users ORDER BY id DESC";
            $stmt = $conn->query($sql);
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            foreach ($users as &$u) {
                $u['image'] = '/assets/images/mentors/default_mentor.jpg';
            }
            echo json_encode($users);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database Error: " . $e->getMessage()]);
    }
}
?>