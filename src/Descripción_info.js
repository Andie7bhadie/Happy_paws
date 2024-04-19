import React, { useRef, useState, useEffect } from "react";
//import imagenDefecto from './img/noImagen.jpg';
import "./App.css";

const enviarData = async (url, data) => {
  //pasamos en la funcioón fetch un objeto que se va a tener que convertir en json
  //añadimos el await para que espere a recibir respuesta
  const respuesta = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return respuesta;
}

function Descripcion() {
  // Para manejar el estado del texto
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const refTexto = useRef(null);
  const refProvincia=useRef(null);
  const [clasificacionSeleccionada, setClasificacionSeleccionada] = useState("");
  const url_Login = "http://localhost/php/prueba-hpaws/src/Descripcion.php";
  const [resultado, setResultado] = useState(null);
  const [reseñas, setReseñas] = useState(null);
  const [mg, setMg] = useState(null);
  const [contador, setContador] = useState(0);
  // Array con las provincias de España
const provinciasEspana = [
  "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Barcelona", "Burgos", "Cáceres", "Cádiz",
  "Cantabria", "Castellón", "Ciudad Real", "Córdoba", "La Coruña", "Cuenca", "Gerona", "Granada", "Guadalajara", "Guipúzcoa",
  "Huelva", "Huesca", "Islas Baleares", "Jaén", "León", "Lérida", "Lugo", "Madrid", "Málaga", "Murcia", "Navarra", "Orense",
  "Palencia", "Las Palmas", "Pontevedra", "La Rioja", "Salamanca", "Segovia", "Sevilla", "Soria", "Tarragona", "Santa Cruz de Tenerife",
  "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza"
];
  useEffect(() => {
    // Función para eliminar los mensajes después de x segundos 
    const eliminarMensajes = () => {
      setTimeout(() => {
        setError(null);
        setMensaje(null);
      }, 7000);
    };

    // Llamar a la función para eliminar los mensajes cuando cambien
    if (error || mensaje) {
      eliminarMensajes();
    }
  }, [error, mensaje]);

  useEffect(() => {
    // Función asíncrona para obtener las listas de profesionales
    const obtenerListasProf = async () => {
      try {
        const data = {
          "id_profesionales": localStorage.getItem("id_profesionales")
        };
        const url_listas = "http://localhost/php/prueba-hpaws/src/Listas_Profesional.php";
        const url_Descripcion = "http://localhost/php/prueba-hpaws/src/Descripcion.php";

        const Listas_Profesional = await enviarData(url_listas, data);
        const Descripcion = await enviarData(url_Descripcion, data);

        const jsonListas = await Listas_Profesional.json();
        const jsonDescripcion = await Descripcion.json();

      
        setResultado(jsonDescripcion.texto);
        setReseñas(jsonListas.reseñas);
        setMg(jsonListas.total_favoritos);

      } catch (error) {
        setError('Error al obtener las listas de profesionales');
      }
    };

    obtenerListasProf();
  }, []);
  
    const handleInputChange = (event) => {
      const texto = event.target.value;
      setContador(texto.length);
    };


  const HandleSubmit = async (event) => {
    event.preventDefault();
    const texto = refTexto.current.value.trim();

    if (texto.length > 250) {
      setMensaje('El texto no puede tener más de 250 caracteres.');
      return;
    }
    if (clasificacionSeleccionada==='') {
      setMensaje('Tienes que seleccionar una opción de servicios.');
      return;
    }
    if(refProvincia.current.value===''){
      setMensaje('Rellena tu ubicación.');
      return;
    }
    if (!provinciasEspana.includes(refProvincia.current.value)) {
      setMensaje('Debes seleccionar una provincia de España.La primera letra con mayúscula');
      return;}

    const data = {
      "texto": refTexto.current.value,
      "clasificacion": clasificacionSeleccionada,
      "id_profesionales": localStorage.getItem("id_profesionales"),
      "provincia":refProvincia.current.value
    };
    try {
      const Json = await enviarData(url_Login, data);
      const jsonResponse = await Json.json();
      
      if (jsonResponse && jsonResponse.mensaje) {
        setMensaje(jsonResponse.mensaje);
        if (jsonResponse.texto) {
          setResultado(jsonResponse.texto);
        }
      } else {
        setError("Error desconocido al procesar la solicitud.");
      }
    } catch (error) {
      setError("Error al comunicarse con el servidor: " + error.message);
    }
  };

  return (
    <div className="Descripción">
      
      <form>
      <h2>Descripción</h2>
        <textarea
        className="descrip"
          placeholder="Escribe aquí una breve descripción..."
          rows={6}
          cols={40}
          ref={refTexto}
          onChange={handleInputChange}
        />
<p>Caracteres restantes: {250 - contador}</p>
        <div className="Clasificacion">
          <p >Ofrezco servicios de:</p>
          <select
            name="clasificacion"
            value={clasificacionSeleccionada}
            onChange={(e) => setClasificacionSeleccionada(e.target.value)}
          >
            <option value="">Todas las clasificaciones</option>
            <option value="veterinario">Veterinario</option>
            <option value="cuidador">Cuidador</option>
            <option value="peluquero">Peluquero</option>
          </select>
        </div>
        <textarea
        className="provincia"
          placeholder="¿De que provincia eres?"
          rows={1}
          cols={20}
          ref={refProvincia}
        />
        <div>
          {error && <div className="alert-error">{error}</div>}
          {mensaje && <div className="alert-success">{mensaje}</div>}
        </div>
        <button className="enviar" onClick={HandleSubmit} type="submit">
          Enviar
        </button>
      </form>

      <div className="View">
        <p>
          Esta es tu descripción <br />
          {resultado ? resultado : "No hay descripción disponible"}
        </p>
      </div>


      <div className="Lista">
  {reseñas !== undefined && reseñas !== null && reseñas.length > 0 ? (
    <div>
      <p>Estas son tus reseñas</p>
      <br />
      <ul>
        {reseñas.map((reseña, index) => (
          <li key={index}>{reseña.texto_reseña}</li>
        ))}
      </ul>
    </div>
  ) : (
    reseñas !== undefined && reseñas !== null && reseñas.length === 0 && (
      <p>Aun no tienes reseñas</p>
    )
  )}
</div>


      <div className="Me-gusta">
        <p>¡Le gustas a {mg !== null && mg !== 0 ? mg : 0} personas!</p>
      </div>

    </div>
  );
}

export default Descripcion;
