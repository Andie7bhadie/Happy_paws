<?php
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers:*");

include_once "base_de_datos.php";

$connect = ObtenerConexion();
$JSONData = file_get_contents("php://input");
$dataObject = json_decode($JSONData);
$id_profesional = $dataObject->id_profesionales;
$id_cliente = $dataObject->id_clientes;
$reseña = $dataObject->reseña;

// Verificar si ya existe una reseña para el profesional y cliente específicos
$sql_select = "SELECT id_reseña FROM reseña WHERE id_profesionales = ? AND id_clientes = ?";
$sentencia_select = $connect->prepare($sql_select);
$sentencia_select->bind_param("ii", $id_profesional, $id_cliente);
$sentencia_select->execute();
$resultado_select = $sentencia_select->get_result();

if ($resultado_select->num_rows > 0) {
    // Ya existe una reseña, por lo tanto, actualizamos en lugar de insertar
    $sql_update = "UPDATE reseña SET texto_reseña = ? WHERE id_profesionales = ? AND id_clientes = ?";
    $sentencia_update = $connect->prepare($sql_update);
    $sentencia_update->bind_param("sii", $reseña, $id_profesional, $id_cliente);
    $resultado_update = $sentencia_update->execute();

    if ($resultado_update) {
        echo json_encode(["mensaje" => "Reseña actualizada correctamente"]);
    } else {
        echo json_encode(["error" => "Error al actualizar la reseña"]);
    }

    $sentencia_update->close();
} else {
    // No existe una reseña, por lo tanto, insertamos una nueva
    $sql_insert = "INSERT INTO reseña (id_profesionales, id_clientes, texto_reseña) VALUES (?, ?, ?)";
    $sentencia_insert = $connect->prepare($sql_insert);
    $sentencia_insert->bind_param("iis", $id_profesional, $id_cliente, $reseña);
    $resultado_insert = $sentencia_insert->execute();

    if ($resultado_insert) {
        echo json_encode(["mensaje" => "Reseña guardada correctamente"]);
    } else {
        echo json_encode(["error" => "Error al guardar la reseña"]);
    }

    $sentencia_insert->close();
}

$sentencia_select->close();
$connect->close();
