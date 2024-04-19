<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers:*");


$datosJSON = file_get_contents("php://input");
$datos = json_decode($datosJSON);

// Verifica si se pudo decodificar el JSON correctamente
if ($datos === null) {
    echo json_encode(array("success" => 'no se pudo decodificar'));
    exit; // Termina la ejecución del script si no se pudo decodificar el JSON
}// si el id, es el del admin no se puede eliminar
if ($datos->id_clientes == 24) {
    echo json_encode(array("success" => false, 'error'=>'No se puede eliminar al administrador'));
    exit; // Termina la ejecución del script
}

// Obtiene el ID del cliente
$id_clientes = $datos->id_clientes;

    // Realiza la conexión a la base de datos
    include_once "Base_de_datos.php";
    $connect = ObtenerConexion();

    // Prepara la consulta SQL para eliminar al cliente
    $sentencia = $connect->prepare("DELETE FROM clientes WHERE id_clientes = ?");
    $sentencia->bind_param("i", $id_clientes); 
    $resultado = $sentencia->execute();
 
    // Si la consulta se ejecutó correctamente
    if ($resultado) {
                echo json_encode(array("success" => true));
    } else {
                echo json_encode(array("success" => 'no hay resultado'));
    }
 // Cierra la conexión y la sentencia preparada
 $sentencia->close();
 $connect->close();



