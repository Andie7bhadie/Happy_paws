import React, { useRef, useState } from 'react';
import './App.css';
import {navigate} from './Link.js';

const FormularioLog = () => {
  const [error,setError]=useState(null);
  const refUsuario= useRef(null);
  const refpassword= useRef(null);

  const enviarData = async(url,data)=>{
    //pasamos en la funcioón fetch un objeto que se va a tener que convertir en json
    //añadimos el await para que espere a recibir respuesta
    const respuesta = await fetch( url,{
      method:'POST',
      body :JSON.stringify(data),
      headers:{
        'Content-Type':'application/json',
          }
    });
    const respuesta_Json=await respuesta.json();
            return respuesta_Json;
    
    }

const HandleLogin =async(event)=>{//creamos un objeto para enviar los datos
  event.preventDefault();
  const data={
    "email":refUsuario.current.value,
    "password":refpassword.current.value
  };
  const url_Login ="http://localhost/php/prueba-hpaws/src/InicioSesion.php";
  const Json=await enviarData(url_Login, data);
  //Administrador o cliente?
  if( "Andrea@ilerna.com"===refUsuario.current.value &&
"777"===refpassword.current.value){
   if (Json.conectado){
    navigate('/Perfil_administrador');
    
  }else{
  setError(Json.error);}//asiganmos el mensaje de error del servidor
}else{
  
  if (Json.conectado){
    navigate('/Perfil_Usuario');
    localStorage.setItem("id_clientes",parseInt(Json.id_clientes));
 const response2 = await enviarData("http://localhost/php/prueba-hpaws/src/Listas_Usuario.php" , Json.id_clientes);
  } else {
  setError(Json.error)}//asiganmos el mensaje de error del servidor
}
}

  return (
    <div>
      <form className='formulario'>
      <label htmlFor="userEmail6">Correo:</label>
      <input
        type="email" 
        id="userEmail6"
        name="userEmail" 
        ref={refUsuario}
        
      />
      <br />
      <label htmlFor="password2">Contraseña:</label>
      <input
        type="password"
        id="password2"
        name="password" 
        ref={refpassword}
      
      />
      <br />
      <div>
        {
          error&&
          <div className='alert-error'>
            {error}
          </div>
        }
      </div>
      <button className='Botonform' onClick={HandleLogin}
      type="buttom">Enviar</button>
    </form>
    
    </div>
  );
};

export default FormularioLog;
