<?php
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers:*");
header("Access-Control-Allow-Methods: *");

include_once "Base_de_datos.php";
$connect = ObtenerConexion();
$JSONData = file_get_contents("php://input");
$dataObject = json_decode($JSONData); 

$connect->set_charset('utf8');

if ($dataObject === null) {
    // Si los datos JSON no se pueden decodificar, devuelve un mensaje de error
    echo json_encode(array("error" => "Error al decodificar los datos JSON",'conectado2' => false));
    exit; 
}
// Verifica si los datos recibidos tienen las propiedades 'email' y 'password'
if (!isset($dataObject->email) || !isset($dataObject->password)) {
    echo json_encode(array("error" => "Faltan datos de correo electrónico o contraseña",'conectado2' => false));
    exit; 
}
$email =$dataObject->email;  
$password =$dataObject->password;
$consulta = $connect->prepare("SELECT id_profesionales FROM profesionales WHERE email = ? AND password = ?");
$consulta->bind_param("ss", $email,$password);//Esta funcion devuelve un booleano cuando no se prepara bien la consulta
$consulta->execute();
if ($consulta->execute()) {
    $resultado = $consulta->get_result();
    $fila=$resultado->fetch_assoc();//fila asociativa
    
//Verificamos si el array es null:
    if (is_null($fila)) {
        
        echo json_encode([
            'conectado2' => false, 
            'error'=>"No se encontró ningún usuario con ese correo electrónico y contraseña."
        ]);
        
    } else {
                // Accede al ID del cliente
        $id_profesional = $fila['id_profesionales'];
     
       
        echo json_encode([
            'conectado2' =>true,
            'id_profesionales'=>$id_profesional
    ]);
         
           }
} else {
        echo json_encode([
        'conectado2' => false,
        'error'=>'No se ha podido enviar la petición'      
    ]);
} 
    $consulta->close();



