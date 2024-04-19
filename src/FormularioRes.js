import React, { useState, useRef} from 'react';
import './App.css';
//Guardamos la url del servidor
const url_Login = "http://localhost/php/prueba-hpaws/src/NuevoRegistro.php"

/*creamos la funcion que envia los datos
es una función asíncrona, es decir va a tener que esperar al servidor*/
const enviarData = async (url, data) => {
  //pasamos en la funcioón fetch un objeto que se va a tener que convertir en json
  //añadimos el await para que espere a recibir respuesta
  const respuesta = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin':'http://localhost:3000'
    }
  })
  const respuesta_Json = await respuesta.json();
  //console.log(respuesta_Json)//Para ver el mensaje
  return respuesta_Json;
}

const FormularioRes = () => {

  const refNombre = useRef(null);
  const refEmail = useRef(null);
  const refContraseña = useRef(null);
  const refRepContraseña = useRef(null);
  const refisProfesional = useRef(null);
  const [mensaje, setMensaje] = useState('');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nombreRegex = /^[A-Za-zÁ-ú\s'-]+$/;
    const HandleLogin = async (event) => {//creamos un objeto para enviar los datos
      event.preventDefault();
      if(refNombre.current.value!== ''||refEmail.current.value!== ''){
        if (!nombreRegex.test(refNombre.current.value)) {
          setMensaje('Nombre no válido');
          return;
        }
        if (!emailRegex.test(refEmail.current.value)) {
          setMensaje('Correo electrónico no válido');
          return;
        } 

      if (
        refContraseña.current.value === refRepContraseña.current.value &&
        refContraseña.current.value !== '' ){
          const data = {
        "nombre": refNombre.current.value,
        "email": refEmail.current.value,
        "password": refContraseña.current.value,
        "profesional": refisProfesional.current.checked // Obtener el valor del checkbox
      };
      const Json = await enviarData(url_Login, data);
            setMensaje(Json.mensaje);
          }else {
        setMensaje('Las contraseñas no son iguales' );
      }}else{setMensaje('Rellena todo el formulario');}
      
    }
     
  
return (

  <form className='formulario' >

    <label htmlFor="name">Nombre:</label>
    <input
      type="name"
      id="namereg"
      name="name"
      ref={refNombre}

    />

    <label htmlFor="userEmail1">Correo:</label>
    <input
      type="email"
      id="userEmail1"
      name="userEmailreg"
      ref={refEmail}

    />
    <br />
    <label htmlFor="password1">Contraseña:</label>
    <input
      type="password"
      id="password1"
      name="passwordreg"
      ref={refContraseña}
    />
    <br />
    <label htmlFor="repeatPassword1">Repetir contraseña:</label>
    <input
      type="password"
      id="repeatPassword1"
      name="repeatPassword"
      ref={refRepContraseña}

    />

    <br />
    <label className='check'>
      <input
      className='checkbox'
        type="checkbox"
        id="isProfesional"
        name="isProfesional"
        ref={refisProfesional}
              />
      <p>Soy profesional</p>
    </label>
    
    {mensaje && <p className='alert'>{mensaje}</p>}
    <button className='Botonform' onClick={HandleLogin}
      type="Submit">Enviar</button>
  </form>
);
};

export default FormularioRes;
