import React, { useState,useEffect} from 'react';
import "./App.css";
import imagenPorDefecto from './img/noImagen.jpg';

function SubirFotos() {
  const url = "http://localhost/php/prueba-hpaws/src/SubirFotos.php";

  // Estado para las imágenes
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [imageData, setImageData] = useState(null);
  useEffect(() => {
    // Recuperar la imagen del almacenamiento local al montar el componente
    const storedImageData = localStorage.getItem("imageData");
    if (storedImageData) {
      setImageData(storedImageData);
    }
  }, []);

  // Función para manejar la selección de archivos
  const handleFileChange = (event) => {
    const image=event.target.files[0];
    
    // Mostrar la vista previa de la imagen
    const tipos = ['image/jpeg', 'image/png', 'image/gif'];
    if (image && tipos.includes(image.type)) {
      // Archivo válido
      setFile(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
    setError(null);
  }else{
    // Archivo no válido
    setFile(null);
    setImagePreview(null);
    setError('Por favor, selecciona un archivo de imagen válido (JPEG, PNG o GIF).');
  }};

  const enviarImagen = async () => {
    try {
      if (!file) {
        setError('Por favor, selecciona una imagen.');
        return;
      }
      const maxSizeBytes = 2 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        setError('La imagen es demasiado grande. Selecciona una imagen de máximo 2MB.');
        return;
      }
      const formData = new FormData();
      formData.append('imagen', file);
      formData.append('id_profesionales', localStorage.getItem("id_profesionales"));
  
      const respuesta = await fetch(url, {
        method: 'POST',
        body: formData,
      });
  
      if (respuesta.ok) {
        const data = await respuesta.text();
        
          setError(data.error);
          setFile(null);
          setImagePreview(null);
          setImageData(data);
        setMensaje('Imagen subida correctamente.');
        localStorage.setItem("imageData", data);
        
      } else {
        throw new Error('Error al enviar la imagen al servidor.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudo enviar la imagen al servidor.');
    }
  };
  
 

  return (
    <div className="Fotos">
  <div className="SubirFotos">
  <p className="text">Selecciona una imagen para subir</p>
    
        {!imagePreview && <img className="imagen-preview" src={imagenPorDefecto} alt="Imagen por defecto" style={{ maxWidth: '100px', maxHeight: '100px' }}/>}
    
    <input className='inputfoto' type="file" name="imagen" onChange={handleFileChange} />
    
    
      {imagePreview && <img className="imagen-preview" src={imagePreview} alt="Imagen seleccionada" style={{ maxWidth: '100px', maxHeight: '100px' }}/>}
     
      <button onClick={enviarImagen}>Subir Foto</button>
   
    {error && <div className="alert-error">{error}</div>}
    {mensaje && <div className="alert-success">{mensaje}</div>}
  </div>
  <div>
    
    <p className="text">Tu foto de perfil:</p>
    <div className='contenedor-imagen'>
        {imageData && <img className="imagen-preview" src={`data:image/jpeg;base64,${imageData}`} alt="Imagen recibida" />}
        </div>
   
  </div>
</div>

  );
}

export default SubirFotos;
