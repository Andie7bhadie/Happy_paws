<?php
include 'CORS.php';
CorsHeaders();

function ObtenerConexion(){

	$servidor = "localhost";
	$usuario = "root";
	$password = "root";
	$bd = "happy_paws";
	  
	  $conexion = mysqli_connect($servidor, $usuario, $password,$bd);
  
		  if($conexion){
			return $conexion;
		  }else{
			  echo 'Ha sucedido un error inexperado en la conexion de la base de datos';
			  
		  }     
       
}

	  
