<?php
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include_once "base_de_datos.php";

// Obtener conexión
$connect = ObtenerConexion();

// Consulta lista de clientes
$sql1 = "SELECT * FROM clientes";
$consulta1 = $connect->prepare($sql1);
$consulta1->execute();
$resultado1 = $consulta1->get_result();
$clientes = $resultado1->num_rows > 0 ? $resultado1->fetch_all(MYSQLI_ASSOC) : [];

// Consulta lista de profesionales
$sql2 = "SELECT id_profesionales,nombre,email,texto_descripcion,password,clasificación,provincia FROM profesionales";
$consulta2 = $connect->prepare($sql2);
$consulta2->execute();
$resultado2 = $consulta2->get_result();
$profesionales = $resultado2->num_rows > 0 ? $resultado2->fetch_all(MYSQLI_ASSOC) : [];

// Consulta lista de reseñas
$sql3 = "SELECT reseña.id_reseña,texto_reseña, reseña.id_clientes, clientes.nombre AS nombre_cliente, reseña.id_profesionales, profesionales.nombre AS nombre_profesional
        FROM reseña
        INNER JOIN clientes ON reseña.id_clientes = clientes.id_clientes
        INNER JOIN profesionales ON reseña.id_profesionales = profesionales.id_profesionales";
$consulta3 = $connect->prepare($sql3);
$consulta3->execute();
$resultado3 = $consulta3->get_result();
$reseñas = $resultado3->num_rows > 0 ? $resultado3->fetch_all(MYSQLI_ASSOC) : [];

// Consulta lista de guardados
$sql4 = "SELECT guardados.id_guardado, guardados.id_clientes, guardados.id_profesionales, 
                clientes.nombre AS nombre_cliente, 
                profesionales.nombre AS nombre_profesional
         FROM guardados AS guardados
         INNER JOIN clientes ON guardados.id_clientes = clientes.id_clientes
         INNER JOIN profesionales ON guardados.id_profesionales = profesionales.id_profesionales";
$consulta4 = $connect->prepare($sql4);
$consulta4->execute();
$resultado4 = $consulta4->get_result();
$favoritos = $resultado4->num_rows > 0 ? $resultado4->fetch_all(MYSQLI_ASSOC) : [];

// Convertir los datos en un array asociativo
$datos = [
   'clientes' => $clientes,
   'profesionales' => $profesionales,
   'reseñas' => $reseñas,
   'favoritos' => $favoritos
];

// Enviar los datos al cliente
echo json_encode($datos);
// Cerrar la conexión
$connect->close();

