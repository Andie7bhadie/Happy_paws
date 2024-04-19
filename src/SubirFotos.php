<?php
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

// Conectamos con el servidor
include_once "base_de_datos.php";

$connect = ObtenerConexion();

// Obtenemos los datos enviados desde el frontend
$id_profesionales = $_POST['id_profesionales'];
$imagen_tmp = $_FILES['imagen']['tmp_name'];

if (!$id_profesionales) {
  echo json_encode(["error" => "El ID de profesionales no fue proporcionado."]);
  exit;
}

if (!$imagen_tmp || !is_uploaded_file($imagen_tmp)) {
  echo json_encode(["error" => "No se recibió ninguna imagen válida."]);
  exit;
}

// Leer el contenido binario de la imagen
$imagen_binaria = file_get_contents($imagen_tmp);

// Insertar la imagen en la base de datos
$consulta = $connect->prepare("UPDATE profesionales SET imagen = ? WHERE id_profesionales = ?");
$consulta->bind_param('si', $imagen_binaria, $id_profesionales);
if (!$consulta->execute()) {
  echo json_encode(["error" => "Error al guardar la imagen en la base de datos: " . $connect->error]);
  exit;
}

// Obtener la foto actualizada para enviarla en JSON
$consulta = $connect->prepare("SELECT imagen FROM profesionales WHERE id_profesionales = ?");
$consulta->bind_param('i', $id_profesionales);
if (!$consulta->execute()) {
  echo json_encode(["error" => "Error al ejecutar la consulta: " . $consulta->error]);
  exit;
}

$resultado = $consulta->get_result();
if ($resultado->num_rows === 0) {
  echo json_encode(["error" => "No se encontró ninguna foto para el profesional."]);
  exit;
}

$fila = $resultado->fetch_assoc();

// Devolver la imagen en base64 como respuesta
$imagenCodificada = base64_encode($fila['imagen']);
header('Content-Type: image/jpeg');
echo $imagenCodificada;

$connect->close();
