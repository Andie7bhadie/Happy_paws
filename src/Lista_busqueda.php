<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers:*");

// Conectamos con el servidor
include_once "base_de_datos.php";
$connect = ObtenerConexion();
$JSONData = file_get_contents("php://input");
$dataObject = json_decode($JSONData); 
$connect->set_charset('utf8');

// Variables con los datos que vamos a necesitar
$busqueda = $dataObject->busqueda;
$clasificacion = $dataObject->clasificacion;

// CONSULTAS
if ($busqueda === "" && ($clasificacion === "Todas las clasificaciones"|| $clasificacion === "")) {
  $sql = "SELECT  p.texto_descripcion, p.email, p.nombre, p.id_profesionales, GROUP_CONCAT(r.texto_reseña) AS texto_reseña
  FROM profesionales p
  LEFT JOIN reseña r ON p.id_profesionales = r.id_profesionales
  GROUP BY p.id_profesionales;";
  $sentencia = $connect->prepare($sql);
  $sql2 = "SELECT imagen FROM profesionales;";
  $sentencia2 = $connect->prepare($sql2);

} else if ($busqueda !== "" && ($clasificacion === "Todas las clasificaciones"|| $clasificacion === "")) {
  $sql = "SELECT  p.texto_descripcion, p.email, p.nombre, p.id_profesionales, GROUP_CONCAT(r.texto_reseña) AS texto_reseña
  FROM profesionales p
  LEFT JOIN reseña r ON p.id_profesionales = r.id_profesionales
  WHERE p.provincia=? 
  GROUP BY p.id_profesionales;";
  $sentencia = $connect->prepare($sql);
  $sentencia->bind_param('s', $busqueda);

  $sql2 = "SELECT  p.imagen FROM profesionales p WHERE p.provincia=?;";
    $sentencia2 = $connect->prepare($sql2);
  $sentencia2->bind_param('s', $busqueda);

} else if ($busqueda === "" && $clasificacion !== "Todas las clasificaciones") {
  $sql = "SELECT  p.texto_descripcion, p.email, p.nombre, p.id_profesionales, GROUP_CONCAT(r.texto_reseña) AS texto_reseña
  FROM profesionales p
  LEFT JOIN reseña r ON p.id_profesionales = r.id_profesionales
  WHERE p.clasificación=?
  GROUP BY p.id_profesionales;";
  $sentencia = $connect->prepare($sql);
  $sentencia->bind_param('s', $clasificacion);

  $sql2 = "SELECT  p.imagen FROM profesionales p WHERE p.clasificación=?;";
  $sentencia2 = $connect->prepare($sql2);
  $sentencia2->bind_param('s', $clasificacion);

}  else {
  $sql = "SELECT  p.texto_descripcion, p.email, p.nombre, p.id_profesionales, GROUP_CONCAT(r.texto_reseña) AS texto_reseña
  FROM profesionales p
  LEFT JOIN reseña r ON p.id_profesionales = r.id_profesionales
  WHERE p.provincia=? AND p.clasificación=?
  GROUP BY p.id_profesionales;";
  $sentencia = $connect->prepare($sql);
  $sentencia->bind_param('ss', $busqueda, $clasificacion);

  $sql2 = "SELECT  p.imagen FROM profesionales p WHERE p.provincia=? AND p.clasificación=?";
  $sentencia2 = $connect->prepare($sql2);
  $sentencia2->bind_param('ss', $busqueda, $clasificacion);
}

// Ejecutar la consulta
if (!$sentencia->execute()) {
  echo json_encode(["error" => "Error al ejecutar la consulta: " . $sentencia->error]);
  exit;
}
$resultado = $sentencia->get_result();
// Verificar si hay resultados
if ($resultado->num_rows === 0) {
  echo json_encode(["mensaje" => "No se encontró ningún profesional"]);
  exit;
}

$listaBusqueda = array();
while ($fila = $resultado->fetch_assoc()) {
  $listaBusqueda[] = $fila;
}

// Ejecutar la segunda consulta para obtener las imágenes
if (!$sentencia2->execute()) {
  echo json_encode(["error" => "Error al ejecutar la consulta de imágenes: " . $sentencia2->error]);
  exit;
}
$resultado2 = $sentencia2->get_result();
$imagenes = array();
while ($fila2 = $resultado2->fetch_assoc()) {
  $imagenBase64 = base64_encode($fila2['imagen']);
  $imagenes[] = $imagenBase64;
}

echo json_encode([
  "profesionales" => $listaBusqueda,
  "imagenes" => $imagenes
]);
// Cerrar la consulta
$sentencia->close();
$sentencia2->close();

