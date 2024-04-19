<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include_once "Base_de_datos.php";
$connect = ObtenerConexion();


$JSONData = file_get_contents("php://input");
$dataObject = json_decode($JSONData);

// Validar  los datos recibidos
if (!isset($dataObject->id_profesionales) || !isset($dataObject->id_clientes)) {
    echo json_encode(["error" => "Los datos recibidos son incorrectos"]);
    exit;
}


$usuarioId = $dataObject->id_clientes;
$id_profesionales = $dataObject->id_profesionales;
$connect->set_charset('utf8');

// Consultar si existe una fila con los mismos valores
$sql_select = "SELECT * FROM guardados WHERE id_profesionales = ? AND id_clientes = ?";
$stmt_select = $connect->prepare($sql_select);
$stmt_select->bind_param('ii', $id_profesionales, $usuarioId);
$stmt_select->execute();
$resultado_select = $stmt_select->get_result();

// Verificar si existe una fila 
if ($resultado_select->num_rows > 0) {
    // Eliminar la fila existente
    $sql_delete = "DELETE FROM guardados WHERE id_profesionales = ? AND id_clientes = ?";
    $stmt_delete = $connect->prepare($sql_delete);
    $stmt_delete->bind_param('ii', $id_profesionales, $usuarioId);
    $resultado_delete = $stmt_delete->execute();

    if ($resultado_delete) {
        echo json_encode(["mensaje" => "Fila eliminada correctamente"]);
    } else {
        echo json_encode(["error" => "Error al eliminar la fila"]);
    }
    
    $stmt_delete->close();
} else {
    // No se encontró ninguna fila, insertar una nueva fila
    $sql_insert = "INSERT INTO guardados (id_profesionales, id_clientes) VALUES (?, ?)";
    $stmt_insert = $connect->prepare($sql_insert);
    if (!$stmt_insert) {
        echo json_encode(["error" => "Error al preparar la consulta INSERT: " . $connect->error]);
        exit;
    }
    $stmt_insert->bind_param('ii', $id_profesionales, $usuarioId);
    $resultado_insert = $stmt_insert->execute();
    $stmt_insert->close();

    if ($resultado_insert) {
        echo json_encode(["mensaje" => "Fila creada correctamente"]);
    } else {
        echo json_encode(["error" => "Error al crear la fila"]);
    }
}


$connect->close();

