//este es el perfil del usuario CLIENTE que renderizara el encabezado y una lista de usuarios según la busqueda
import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import logo from './img/Happy_Paws_patas.png';
import { navigate } from './Link.js';
import imagenPorDefecto from './img/noImagen.jpg';
import mg from './img/corazon-lleno.png';
import nmg from './img/corazon-vacio.png';
const enviarData = async (url, data) => {
  //pasamos en la función fetch un objeto que se va a tener que convertir en json
  //añadimos el await para que espere a recibir respuesta
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error al enviar los datos al servidor');
    }

    const resultado = await response.json();

    return resultado;
  } catch (error) {
    throw new Error('Error al procesar la respuesta del servidor: ' + error.message);
  }
};

function Perfil_usuario() {
  const [profesionales, setProfesionales] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const refBuscador = useRef(null);
  const [clasificacionSeleccionada, setClasificacionSeleccionada] = useState("");
  const [ListaFavoritos, setListaFavoritos] = useState([]);
  const [ListaReseñas, setListaReseñas] = useState([]);
  const [mostrarReseña, setMostrarReseña] = useState(false);
  const [reseñas, setReseñas] = useState({});
  const [error, setError] = useState(null);
  const [errorbus, setErrorbus] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const url = "http://localhost/php/prueba-hpaws/src/Lista_busqueda.php";

  const handleSearch = async (event) => {
    event.preventDefault();
    const data = {
      "busqueda": refBuscador.current.value,
      "clasificacion": clasificacionSeleccionada
    };

    try {
      const resultado = await enviarData(url, data);
      if (resultado && resultado.profesionales) {
        setProfesionales(resultado.profesionales);
        setImagenes(resultado.imagenes);
      }else{
        setProfesionales([]); // Establecer la lista de profesionales vacía
      setImagenes([]); // Establecer la lista de imágenes vacía
      setErrorbus('No se encontraron profesionales.');
      }
    } catch (error) {
      setErrorbus('Error al procesar la solicitud:');
    }
  };


  //Me gusta///////////
  const handleLike = async (id_profesionales) => {

    const profesionalIndex = profesionales.findIndex(profesional => profesional.id_profesionales === id_profesionales);
    if (profesionalIndex === -1) return;
    const updatedProfesionales = [...profesionales];
    const profesional = updatedProfesionales[profesionalIndex];
    profesional.liked = !profesional.liked;
    setProfesionales(updatedProfesionales);

    try {
      const response = await fetch("http://localhost/php/prueba-hpaws/src/Megusta.php", {
        method: 'POST', // o POST según corresponda
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_profesionales,
          liked: profesional.liked,
          "id_clientes": localStorage.getItem("id_clientes")
        }),
      });
      const respuesta = await response.json();
      obtenerFavoritosDelBackend();
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  }
  const obtenerFavoritosDelBackend = async () => {
    try {
      const idClientes = localStorage.getItem("id_clientes");
      const requestData = {
        id_clientes: idClientes
      };

      const response = await fetch("http://localhost/php/prueba-hpaws/src/Listas_Usuario.php", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      setListaFavoritos(data.Lista_favoritos);
      setListaReseñas(data.reseñas);
    } catch (error) {
      console.error('Error al obtener los favoritos:', error);
    }
  };
  useEffect(() => {
    obtenerFavoritosDelBackend();
  }, []);

  //RESEÑA/////

  const handleReseñaChange = (e, id_profesionales) => {
    const nuevaReseña = { ...reseñas };
    nuevaReseña[id_profesionales] = e.target.value;
    setReseñas(nuevaReseña);
  };

  const handleReseñaSubmit = async (id_profesionales) => {
    const texto = reseñas[id_profesionales].trim();

    if (texto.length > 250) {
      setError('El texto no puede tener más de 250 caracteres.');
      return;
    }
    try {
      const data = {
        "reseña": reseñas[id_profesionales],
        "id_profesionales": id_profesionales,
        "id_clientes": localStorage.getItem("id_clientes")
      };
      const resultado = await enviarData("http://localhost/php/prueba-hpaws/src/EnviarReseña.php", data);
      setMostrarReseña(resultado.reseña);
      // Limpiar la reseña para este profesional después de enviarla
      const nuevasReseñas = { ...reseñas };
      nuevasReseñas[id_profesionales] = '';
      setReseñas(nuevasReseñas);
      obtenerFavoritosDelBackend();
    } catch (error) {
      console.error('Error al enviar la reseña');
    }

  };
  //CERRAR SESIÓN////////
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

      if (respuestaJson) {
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
    <div className='Pagina'>
      <div className='barra'>
        <img src={logo} className="logo1" alt="logo" />
        <button className='cerrar' variant="primary" onClick={HandleLogout}>Cerrar Sesión</button>
      </div>


      <div className='Cuerpo-pagina'>
        <form className="buscador">
          <input type="text" name='busqueda' ref={refBuscador} placeholder="Busca por provincias" />
          <select name="clasificacion" value={clasificacionSeleccionada} onChange={(e) => setClasificacionSeleccionada(e.target.value)}>
            <option value="Todas las clasificaciones">Todas las clasificaciones</option>
            <option value="veterinario">Veterinario</option>
            <option value="cuidador">Cuidador</option>
            <option value="peluquero">Peluquero</option>
          </select>
          <div>
            {errorbus && <div className="alert-error">{errorbus}</div>}
          </div>
          <button onClick={handleSearch}>Buscar</button>
        </form>
        
        <div className="contenedor-principal">
        <div className="contenedor-cartas">
          {Object.values(profesionales).map((profesional, index) => (
            <div key={`${profesional.id_profesionales}_${index}`}>
              <button className='like-button' onClick={() => handleLike(profesional.id_profesionales)}>
                {profesional.liked ?
                  <img src={mg} alt="Ya no me gusta" style={{ width: '24px', height: '24px' }} /> :
                  <img src={nmg} alt="Me gusta" style={{ width: '24px', height: '24px' }} />
                }
              </button>
              <h1>{profesional.nombre}</h1>
              {imagenes[index] ? (
                <img className='imagen-profesional' src={`data:image/jpeg;base64,${imagenes[index]}`} alt="imagen profesional" />
              ) : (
                <img className='imagen-profesional' src={imagenPorDefecto} alt="imagen por defecto" />
              )}
              <h3>Descripción:</h3>
              <div className='texto-descripcion'>
                <p >{profesional.texto_descripcion}</p>
              </div>
              <h3>Email:</h3>

              <p>{profesional.email}</p>

              <h3>Reseñas:</h3>
              {/* Renderizar las reseñas del profesional */}
              {profesional.texto_reseña ? (
                <div className='Reseñas'>

                  {profesional.texto_reseña.split(',').map((textoReseña, index) => (
                    <div key={`${profesional.id_profesionales}_reseña_${index}`}>
                      <ul>
                        <li>
                          <p>{textoReseña}</p>
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No hay reseñas disponibles.</p>
              )}
              {/* Fin de renderizado de reseñas */}
              <div className='EnvioReseñas'>
                <textarea
                  value={reseñas[profesional.id_profesionales] || ''}
                  onChange={(e) => handleReseñaChange(e, profesional.id_profesionales)}
                  placeholder="Escribe tu reseña aquí..."
                />
                <div>
                  {error && <div className="alert-error">{error}</div>}
                  {mensaje && <div className="alert-success">{mensaje}</div>}
                </div>
                <button onClick={() => handleReseñaSubmit(profesional.id_profesionales)}>Enviar reseña</button>

              </div>

            </div>
          ))}

        </div>
        </div>
        <div className='Superlista'>
          <div className='Listas'>
            <h2>Lista de Favoritos</h2>
            <ul>
              {ListaFavoritos.map((favorito, index) => (
                <li key={index}>
                  <p>Nombre: {favorito.nombre}</p>
                  <p>Email: {favorito.email}</p>
                </li>
              ))}
            </ul>

          </div>

          <div className='Listas'>
            <h2>Lista de reseñas</h2>
            <ul>
              {ListaReseñas.map((reseña) => (
                <li key={reseña.id_reseña}>
                  <p>Nombre del profesional: {reseña.nombre_profesional}</p>
                  <p>Contacto: {reseña.email_profesional}</p>
                  <p>Opinión: {reseña.texto_reseña}</p>
                </li>
              ))}
            </ul>
          </div>
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
  );
};
export default Perfil_usuario;
