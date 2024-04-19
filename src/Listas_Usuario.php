<?php
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers:*");
//session_start();
include_once "base_de_datos.php";

//Obtenemos conexion
$connect = ObtenerConexion();
$JSONData = file_get_contents("php://input");
$dataObject = json_decode($JSONData); 
$id_cliente=$dataObject->id_clientes;

//Preparamos la consulta para la lista de reseñas que hizo un cliente en concreto
$sql1 = "SELECT r.id_reseña, r.texto_reseña, p.nombre, p.email
FROM reseña r 
JOIN profesionales p ON r.id_profesionales = p.id_profesionales
WHERE r.id_clientes = ?";
$consulta1 = $connect->prepare($sql1);
$consulta1->bind_param('i', $id_cliente);
$consulta1->execute();
$consulta1->bind_result($id_reseña, $texto_reseña, $nombre_profesional, $email_profesional);


// Array para almacenar todas las reseñas
$reseñas = array();
while ($consulta1->fetch()) {
    // Agrega los resultados al array de reseñas
    $reseñas[] = array(
        'id_reseña' => $id_reseña,
        'texto_reseña' => $texto_reseña,
        'nombre_profesional' => $nombre_profesional,
        'email_profesional' => $email_profesional
    );
}
$consulta1->close();

//Preparamos la consulta para ver la cantidad de favoritos que tiene.

$sql2 = "SELECT p.nombre, p.email 
FROM profesionales p
JOIN guardados g ON p.id_profesionales = g.id_profesionales
WHERE g.id_clientes = ?";
$consulta2 = $connect->prepare($sql2);
$consulta2->bind_param('i', $id_cliente);
$consulta2->execute();
$consulta2->bind_result($nombre_profesional, $email_profesional); // Vincular las variables a cada columna devuelta por la consulta
 // Obtener los resultados


$Lista_favoritos = array();
while ($consulta2->fetch()) {
    $Lista_favoritos[] = array(
        "nombre" => $nombre_profesional,
        "email" => $email_profesional
    );
}
$consulta2->close(); 

echo json_encode([
    "Lista_favoritos" => $Lista_favoritos,
    "reseñas" => $reseñas
]);




















