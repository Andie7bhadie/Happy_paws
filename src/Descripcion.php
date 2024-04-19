<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers:*");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Credentials: true");
include_once "base_de_datos.php";

$connect = ObtenerConexion();
$JSONData = file_get_contents("php://input");
$dataObject = json_decode($JSONData); 
$id_profesional = intval($dataObject->id_profesionales);

if ($id_profesional !== null) {
    $connect->set_charset('utf8');

    if (isset($dataObject->texto) && isset($dataObject->clasificacion)) {
        // Si se proporciona una nueva descripción y clasificación, actualizarla en la base de datos
        $texto = $dataObject->texto;
        $clasificacion = $dataObject->clasificacion;
        $provincia = $dataObject->provincia;

        $sentencia = $connect->prepare("UPDATE profesionales SET texto_descripcion = ?, clasificación = ?, provincia=? WHERE id_profesionales = ?");
        $sentencia->bind_param('sssi', $texto, $clasificacion, $provincia,$id_profesional,);
        $resultado = $sentencia->execute();
        $sentencia->close();

        if ($resultado) {
            echo json_encode(["mensaje" => "La descripción se ha actualizado correctamente"]);
        } else {
            echo json_encode(["error" => "Error al actualizar la descripción del profesional"]);
        }
    } else {
        // Si solo se proporciona el ID del profesional, obtener la descripción existente
        $consulta = $connect->prepare("SELECT texto_descripcion FROM profesionales WHERE id_profesionales = ?");
        $consulta->bind_param('i', $id_profesional);

        if ($consulta->execute()) {
            $resultado = $consulta->get_result();

            if ($resultado->num_rows > 0) {
                $fila = $resultado->fetch_assoc();
                echo json_encode(["texto" => $fila["texto_descripcion"]]);
            } else {
                echo json_encode(["mensaje" => "No se encontró ninguna descripción para el profesional"]);
            }
        } else {
            echo json_encode(["error" => "Error al obtener la descripción del profesional: " . $consulta->error]);
        }

        $consulta->close();
    }
} else {
    echo json_encode(["error" => "Falta el ID del profesional"]);
}
?>
