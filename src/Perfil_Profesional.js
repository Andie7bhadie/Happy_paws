/*Archivo que renderiza el perfil del usuario profesional,
renderiza los dos inputs para las fotos de la galeria, y la descripción con la foto de perfil */
import './App.css';
import logo from './img/Happy_Paws_patas.png';
import Descripción from './Descripción_info';
import SubirFotos from './SubirFotosprofesionales';
import {navigate} from './Link.js';

function Perfil_profesional() {
    //Cerrar sesion
   const HandleLogout = async () => {
    try {
        const response = await fetch('http://localhost/php/prueba-hpaws/src/CerrarSesion.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
        const respuestaJson = await response.json();
  
      if (respuestaJson.success) {
        // Redirigir al usuario a la página de inicio
        navigate('/Inicio');
      } else {
        console.error('Error al cerrar la sesión:', respuestaJson.error);
      }
    } catch (error) {
      console.error('Error al enviar la petición:', error);
    }
  };

    return (

        <div className='Perfil_profesional'>

            <div className='barra'>
                <img src={logo} className="logo1" alt="logo" />
                <button className="cerrar" variant="primary" onClick={HandleLogout}>Cerrar Sesión</button>
            </div>
            <div className='cuerpo_pagina'>
                <Descripción />
                <SubirFotos />
            </div>
            <div className='pie_pagina'>
      <p className='texto_pie1'>
        Contacto
      </p>
      <p className='texto_pie2'>
        Redes sociales
      </p>
      
     </div>
        </div>


    );
}
export default Perfil_profesional;