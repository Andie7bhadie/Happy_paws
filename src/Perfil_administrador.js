/* Este archivo renderizará el encabezado y dos listas, una de usuarios clientes,
profesionales y otra de reseñas */
import React, { useState, useEffect } from 'react';
import logo from './img/Happy_Paws_patas.png';
import './App.css';
import { navigate } from './Link.js';

const enviarData = async (url, data) => {
  //pasamos en la funcioón fetch un objeto que se va a tener que convertir en json
  //añadimos el await para que espere a recibir respuesta
  const respuesta = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',

    }
  })
}

function Perfil_administrador() {
  const [listas, setListas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [reseñas, setReseñas] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mensaje1, setMensaje1] = useState('');
  const [error1, setError1] = useState('');
  const [mensaje2, setMensaje2] = useState('');
  const [error2, setError2] = useState('');
  const [mensaje3, setMensaje3] = useState('');
  const [error3, setError3] = useState('');
  const [mensaje4, setMensaje4] = useState('');
  const [error4, setError4] = useState('');
  //Son los valores que se van a introducir en cada componente cuando se rendericen

  const ObtenerDatosListas = async () => {
    try {
      const respuesta = await fetch('http://localhost/php/prueba-hpaws/src/Listas_Admin.php');
      const respuestaJSON = await respuesta.json();
      if (respuestaJSON && respuestaJSON.clientes && respuestaJSON.profesionales) {
        setReseñas(respuestaJSON.reseñas || []);
        setProfesionales(respuestaJSON.profesionales || []);
        setClientes(respuestaJSON.clientes);
        setFavoritos(respuestaJSON.favoritos);
      } else {
        console.error('El JSON devuelto no tiene la estructura esperada:', respuestaJSON);
      }
    } catch (error) {
      setError('Error al obtener las listas');
    }

  };
  // Obtener los datos cuando el componente se monte
  useEffect(() => {
    ObtenerDatosListas();
  }, []);
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
  //CONFIRMACION ELIMINAR.
  function confirmarEliminacion(props) {
    return new Promise((resolve) => {
      const confirmacion = window.confirm('¿Estás seguro querer eliminar este elemento?');
      resolve(confirmacion);
    });
  }
  //BOTONES ELIMINAR
  let response;
  const handleEliminarCli = async (idCliente) => {
    if (idCliente == 24) {
      setError('No se puede eliminar al administrador');
          }else{
    const confirmacion = await confirmarEliminacion(idCliente);
    if (confirmacion) {
      try {

        response = await enviarData('http://localhost/php/prueba-hpaws/src/eliminar_clientes.php', { id_clientes: idCliente });
        if (response === undefined) {
          const nuevosClientes = clientes.filter((cliente) => cliente.id_clientes !== idCliente);
          setClientes(nuevosClientes);
         
        }

      } catch { setError('Error al enviar la peticion de eliminación'); }
    }

  }};

  const HandleEliminarRe = async (idReseña) => {
    const confirmacion = await confirmarEliminacion(idReseña);
    if (confirmacion) {
      try {

        const response = await enviarData('http://localhost/php/prueba-hpaws/src/eliminar_reseñas.php', { id_reseña: idReseña });
        if (response === undefined) {

          const nuevosReseñas = reseñas.filter((reseña) => reseñas.id_reseña !== idReseña);
          setReseñas(nuevosReseñas);
        
        }

      } catch {
        setError('Error al enviar la peticion de eliminación');

      }
    }

  };
  const HandleEliminarFav = async (idFav) => {
    const confirmacion = await confirmarEliminacion(idFav);
    if (confirmacion) {
      try {

        const response = await enviarData('http://localhost/php/prueba-hpaws/src/eliminar_guardados.php', { id_guardados: idFav });
        if (response === undefined) {

          const nuevosFavoritos = favoritos.filter((favorito) => favoritos.id_guardados !== idFav);
          setFavoritos(nuevosFavoritos);
        
          return;

        }

      } catch {
        setError('Error al enviar la peticion de eliminación');
      }
    }
  };
  const HandleEliminarPro = async (idProfesional) => {
    const confirmacion = await confirmarEliminacion(idProfesional);
    if (confirmacion) {
      try {
        const response = await enviarData('http://localhost/php/prueba-hpaws/src/eliminar_profesionales.php', { id_profesionales: idProfesional });
        if (response === undefined) {
                    const nuevosProfesionales = profesionales.filter((profesional) => profesionales.id_profesionales !== idProfesional);
          setFavoritos(nuevosProfesionales);
                
          return;

        }

      } catch {
        setError('Error al enviar la peticion de eliminación');
      }
    }

  };

  return (
    <div className='Perfil_admin'>
      <div className='barra'>
        <img src={logo} className="logo1" alt="logo" />
        <h1>Bienvenido Super Admin</h1>
        <button className='cerrar' variant="primary" onClick={HandleLogout}>Cerrar Sesión</button>
      </div>
     
      
      <div className='Tablas'>
        <div className='clientes'>
          <h1>Clientes</h1>
          <table>
            <thead>
              <tr>
                <th>ID </th>
                <th>Nombre </th>
                <th>Email</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              {clientes && clientes.map(cliente => (
                <tr key={cliente.id_clientes}>
                  <td>{cliente.id_clientes}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.password}</td>
                  <td>
                    <button onClick={() => handleEliminarCli(cliente.id_clientes)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {error && <p className='alert-error'>{error}</p>}
        </div>
        <div className='reseñas'>
          <h1>Reseñas</h1>
          <table>
            <thead>
              <tr>
                <th>ID Reseña</th>
                <th>Texto</th>
                <th>ID Cliente</th>
                <th>Nombre Cliente</th>
                <th>ID Profesional</th>
                <th>Nombre Profesional</th>


              </tr>
            </thead>
            <tbody>
              {reseñas.map(reseña => (
                <tr key={reseña.id_reseña}>
                  <td>{reseña.id_reseña}</td>
                  <td>{reseña.texto_reseña}</td>
                  <td>{reseña.id_clientes}</td>
                  <td>{reseña.nombre_cliente}</td>
                  <td>{reseña.id_profesionales}</td>
                  <td>{reseña.nombre_profesional}</td>

                  <td>
                    <button onClick={() => HandleEliminarRe(reseña.id_reseña)}>Eliminar</button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        
        </div>
        <div className='favoritos'>
          <h1>Favoritos</h1>
          <table>
            <thead>
              <tr>
                <th>ID favorito</th>
                <th>ID Profesional</th>
                <th>Nombre Profesional</th>
                <th>ID Cliente</th>
                <th>Nombre Cliente</th>

              </tr>
            </thead>
            <tbody>
              {favoritos.map(favorito => (
                <tr key={favorito.id_guardado}>
                  <td>{favorito.id_guardado}</td>
                  <td>{favorito.id_profesionales}</td>
                  <td>{favorito.nombre_profesional}</td>
                  <td>{favorito.id_clientes}</td>
                  <td>{favorito.nombre_cliente}</td>
                  <td>
                    <button onClick={() => HandleEliminarFav(favorito.id_guardado)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
         
        </div>
        <div className='profesionales'>
          <h1>Profesionales</h1>
          <table>
            <thead>
              <tr>
                <th>ID </th>
                <th>Nombre </th>
                <th>Email</th>
                <th>Descripción</th>
                <th>Password</th>
                <th>Clasificación</th>
                <th>Provincia</th>
              </tr>
            </thead>
            <tbody>
              {profesionales.map(profesional => (
                <tr key={profesional.id_profesionales}>
                  <td>{profesional.id_profesionales}</td>
                  <td>{profesional.nombre}</td>
                  <td>{profesional.email}</td>
                  <td>{profesional.texto_descripcion}</td>
                  <td>{profesional.password}</td>
                  <td>{profesional.clasificación}</td>
                  <td>{profesional.provincia}</td>
                  <td>
                    <button onClick={() => HandleEliminarPro(profesional.id_profesionales)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>

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
  )
};
export default Perfil_administrador;