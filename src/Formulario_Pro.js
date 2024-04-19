import React, { useRef,useState } from 'react';
import './App.css';
import {navigate} from './Link.js';
const FormularioLog2 = () => {
  
  const url_Login ="http://localhost/php/prueba-hpaws/src/InicioSesion_Profesionales.php"
  const refUsuario= useRef(null);
  const refContraseña= useRef(null);
  const [error,setError]=useState(null);
  const enviarData = async(url,data)=>{
    //pasamos en la funcioón fetch un objeto que se va a tener que convertir en json
    //añadimos el await para que espere a recibir respuesta
    const respuesta = await fetch( url,{
      method:'POST',
      body :JSON.stringify(data),
      headers:{
        'Content-Type':'application/json'
              }
    });
    const respuesta_Json=await respuesta.json();
      return respuesta_Json;
    }
     
const HandleLogin =async(event)=>{//creamos un objeto para enviar los datos
  event.preventDefault();
  
  const data={
    "email":refUsuario.current.value,
    "password":refContraseña.current.value
  }
   const response = await enviarData(url_Login , data);
  
 if (response.conectado2){
  navigate('/Perfil_Profesional');
 localStorage.setItem("id_profesionales",parseInt(response.id_profesionales));
 const url2="http://localhost/php/prueba-hpaws/src/Listas_Profesional.php";
 const data2={
  "id_profesionales":response.id_profesionales
  }
 const response2 = await enviarData( url2,data2);
     } else{
      setError(response.error);
     }
 };
//------------------------------------------------------------------------------------------------------------------------------------------------
  return (
    <div>
      <form className='formulario'>
      <label htmlFor="userEmail2">Correo:</label>
      <input
        type="email" 
        id="userEmail5"
        name="userEmail3" 
        ref={refUsuario}
        
      />
      <br />
      <label htmlFor="password2">Contraseña:</label>
      <input
        type="password"
        id="password5"
        name="password3" 
        ref={refContraseña}
      
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
      type="Submit">Enviar</button>
    </form>
    
    </div>
  );
};

export default FormularioLog2;
