<?php
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers:*");
header("Access-Control-Allow-Methods: *");
//session_start();
include_once "base_de_datos.php";

//Obtenemos conexion
$connect = ObtenerConexion();

$JSONData = file_get_contents("php://input");
$dataObject = json_decode($JSONData); 


if (isset($dataObject->id_profesionales)) {
    $id = $dataObject->id_profesionales;
    $id_profesional = intval($id);

    if (!isset($cartas)) {
        //Preparamos la consulta para la lista de reseñas
        $sql1 = "SELECT texto_reseña FROM reseña WHERE id_profesionales=?";
        $consulta1 = $connect->prepare($sql1);
        $consulta1->bind_param('i', $id_profesional);
        $consulta1->execute();
        $resultado1 = $consulta1->get_result();

        // Array para almacenar todas las reseñas
        $reseñas = array();
        while ($fila = $resultado1->fetch_assoc()) {
            // Agrega la fila al array de reseñas
            $reseñas[] = $fila;
        }
        $consulta1->close();

        //Preparamos la consulta para ver la cantidad de favoritos que tiene.
        $sql2 = "SELECT COUNT(*) AS total_favoritos FROM guardados WHERE id_profesionales = ?;";
        $consulta2 = $connect->prepare($sql2);
        $consulta2->bind_param('i', $id_profesional);
        $resultado = $consulta2->execute();
        //Almacenamos el resultado en una variable.
        $consulta2->bind_result($total_favoritos);
        $consulta2->fetch();
        $consulta2->close(); 

        $response =  array(
            "total_favoritos" => $total_favoritos,
            "reseñas" => $reseñas
        );
        echo json_encode($response);
    } else {
        echo "El valor de id_profesionales no está definido en los datos recibidos.";
    }
}

