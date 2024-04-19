<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers:*");

$datosJSON = file_get_contents("php://input");
$datos = json_decode($datosJSON);

// Verifica si se pudo decodificar el JSON correctamente
if ($datos === null) {
    echo json_encode(array("success"=>false));
    exit; // Termina la ejecución del script si no se pudo decodificar el JSON
}

// Extrae el ID de la reseña del objeto JSON
$id_profesionales = $datos->id_profesionales;

// Realiza la conexión a la base de datos
include "Base_de_datos.php";
$connect = ObtenerConexion();

// Prepara la consulta SQL para eliminar la reseña con el ID especificado
$sentencia = $connect->prepare("DELETE FROM profesionales WHERE id_profesionales = ?");
$sentencia->bind_param("i", $id_profesionales); // "i" indica que el parámetro es un entero
$resultado = $sentencia->execute();

// Verifica si la consulta se ejecutó correctamente
if ($resultado) {
    echo json_encode(array("success"=>true));
} else {
    echo json_encode(array("success"=>false));
}

// Cierra la conexión y la sentencia preparada
$sentencia->close();
$connect->close();
