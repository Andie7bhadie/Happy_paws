<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers:*");
header("Access-Control-Allow-Methods: *");

include_once "Base_de_datos.php";
$connect = ObtenerConexion();

$JSONData = file_get_contents("php://input");
$dataObject = json_decode($JSONData); 

$connect->set_charset('utf8');

$email = $dataObject->email;  
$password = $dataObject->password;

// Verifica si las credenciales son las predeterminadas
if ($email == 'Andrea@ilerna.com' && $password == '777') {
    echo json_encode([
        'conectado' => true
    ]);
} else {
    // Utiliza una consulta que busque tanto el email como la contraseña
    $consulta = $connect->prepare("SELECT id_clientes FROM clientes WHERE email = ? AND password = ?");
    $consulta->bind_param("ss", $email, $password);
    
    try {
        // Ejecuta la consulta
        $consulta->execute();
        
        // Obtiene los resultados
        $resultado = $consulta->get_result();
        
        // Verifica si se encontraron resultados
        if ($resultado->num_rows === 0) {
            echo json_encode(['conectado' => false, 'error' => 'No existe el usuario o la contraseña es incorrecta.']);
        } else {
            // Accede al ID del cliente
            $fila = $resultado->fetch_assoc();
            $id_clientes = $fila['id_clientes'];
            
            echo json_encode([
                'conectado' => true, 
                'id_clientes' => $id_clientes
            ]);
        }
    } catch (Exception $e) {
        // Manejo de errores
        echo json_encode(['conectado' => false, 'error' => 'Error al ejecutar la consulta.']);
    } finally {
        // Cierra la consulta y la conexión
        $consulta->close();
        $connect->close();
    }
}
?>
