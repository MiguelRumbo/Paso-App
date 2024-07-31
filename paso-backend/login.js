<?php
session_start(); // Inicia la sesión
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Datos de conexión
$servername = "127.0.0.1:3306";
$username = "u872183139_dbAdmin";
$password = '$Paso2024$';
$dbname = "u872183139_paso_db";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Comprobar la conexión
if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión: " . $conn->connect_error]));
}

// Lógica para manejar la solicitud POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = $conn->real_escape_string($data['email']);
    $password = $conn->real_escape_string($data['password']);

    $sql = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['usuario_id']; // Guarda el ID de usuario en la sesión
            
            // Crear una cookie que expire en 30 días
            setcookie('user_id', $user['usuario_id'], time() + (30 * 24 * 60 * 60), "/");
            
            echo json_encode([
                "message" => "Inicio de sesión exitoso",
                "user_id" => $user['usuario_id']
            ]);
        } else {
            echo json_encode(["error" => "Contraseña incorrecta"]);
        }
    } else {
        echo json_encode(["error" => "Usuario no encontrado"]);
    }
}

$conn->close();
?>
