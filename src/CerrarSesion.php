<?php
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers:*");

// Iniciar sesión
session_start();

// Destruir la sesión
session_destroy();
echo json_encode(array("success" => 'true'));


