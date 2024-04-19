<?php
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers:*");
header("Access-Control-Allow-Methods: *");

include_once "Base_de_datos.php";
$connect = ObtenerConexion();

$JSONData = file_get_contents("php://input");/*obtiene el contenido de la solicitud HTTP
entrante en formato JSON. php://input es un flujo especial
de entrada de PHP que permite acceder a los datos 
sin procesar del cuerpo de la solicitud POST.*/
$dataObject = json_decode($JSONData);

session_start();

$connect->set_charset('utf8');
if ($dataObject === null) {
       echo json_encode(["mensaje" => "Algo salió mal.No se han decodificado bien los datos"]);
} else {
    //DATOS SERVIDOR
    $email = $dataObject->email;
    $password = $dataObject->password;
    $nombre = $dataObject->nombre;
    $isProfesional = $dataObject->profesional;


    //Si el checkbox esta seleccionado y además alguno de los datos no está presente salir
    if ($isProfesional=="true") //PARA USUARIOS PROFESIONALES
    {
        $datos = $connect->prepare("SELECT id_profesionales FROM profesionales WHERE email=? AND password=?");
        $datos->bind_param('ss', $email, $password);
        $datos->execute();
        $resultado = $datos->get_result();
        $fila = $resultado->fetch_assoc();

        if (is_null($fila)) {//si no se encontro a ningun usuario

            $sentencia = $connect->prepare("INSERT INTO profesionales (nombre, email, password) VALUES (?, ?, ?)");
            $sentencia->bind_param('sss', $nombre, $email, $password);
            $resultado = $sentencia->execute();
            echo json_encode(["mensaje" => "El usuario profesional se ha registrado correctamente"]); # Pasar en el mismo orden de los ?
            #execute regresa un booleano. True en caso de que todo vaya bien, falso en caso contrario.
            #Con eso podemos evaluar

        } else {
            echo json_encode(["mensaje" => "El usuario profesional ya existe"]);
        }

    } else {//PARA USUARIOS CLIENTES
        $datos = $connect->prepare("SELECT id_clientes FROM clientes WHERE email=? AND password=?");
        $datos->bind_param('ss', $email, $password);
        $datos->execute();
        $resultado = $datos->get_result();
        $fila = $resultado->fetch_assoc();
        if (is_null($fila)) {//si no se encontro a ningun usuario
            $sentencia = $connect->prepare("INSERT INTO clientes (nombre,email,password) VALUES (?,?,?);");
            $sentencia->bind_param('sss', $nombre, $email, $password);
            $resultado = $sentencia->execute();
            echo json_encode(["mensaje" => "El usuario cliente se ha registrado correctamente"]);# Pasar en el mismo orden de los ?
            #execute regresa un booleano. True en caso de que todo vaya bien, falso en caso contrario.
            #Con eso podemos evaluar
        } else {
            echo json_encode(["mensaje" => "El usuario cliente ya existe"]);
        }
    }
}
$connect->close();

