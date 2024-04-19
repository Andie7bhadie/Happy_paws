import { useState } from "react";
import enviarData from './Formulario';
function Reseñas() {

    const TablaReseñas = (reseñas) => {
        const [mensaje,setMensaje]=useState('');
                const [error,setError]=useState('');
        const HandleEliminarRe= async (idReseña) => {
            
            try {
                // Envía una solicitud al backend para eliminar la reseña con el ID proporcionado
                
                const response = await enviarData('http://localhost/php/prueba-hpaws/src/eliminar_reseñas.php', { id_reseña: idReseña });
                console.log(response); // Maneja la respuesta del backend, por ejemplo, muestra un mensaje de éxito
                setMensaje(response.mensaje);
                setError(response.error);
            } catch (error) {
                setError('Error al eliminar reseña');
            }
        };
        //se renderizará una lista del mapa corresponidente
        return (

                <div className='reseñas'>
                    <h1>Reseñas</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>ID Reseña</th>
                                <th>ID Cliente</th>
                                <th>Nombre Cliente</th>
                                <th>ID Profesional</th>
                                <th>Nombre Profesional</th>
                                

                            </tr>
                        </thead>
                        <tbody>
                            {reseñas.map(reseña => (
                                <tr key={reseña.id_reseña}>
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
                    {mensaje && <p>{mensaje}</p>}
                {error && <p>{error}</p>}
                </div>
        )
    };
}
export default Reseñas;