### Happy_paws

 ### ¿De qué va este proyecto?
 
Este proyecto consiste en el desarrollo de una aplicación web de servicios para mascotas llamada Happy Paws. La idea surge de la necesidad de simplificar la búsqueda de servicios como veterinario, peluquero y cuidadores para las mascotas, proporcionando una plataforma centralizada y fácil de usar.

---

 ### Estructura de la Aplicación
 
-Clientes: Los clientes son usuarios que buscan servicios para sus mascotas. Pueden explorar perfiles de profesionales, dejar reseñas, contactar con ellos y guardar sus perfiles favoritos.
-Profesionales: Los profesionales son quienes brindan servicios para mascotas, como veterinarios, peluqueros y cuidadores. Pueden crear y completar su perfil, subir información relevante y gestionar las reservas y reseñas de los clientes.
-Administradores: Los administradores tienen funciones de gestión y mejora de la plataforma. Pueden añadir funcionalidades, gestionar usuarios y supervisar la actividad en la aplicación.

### Estructura de la base de datos

### Tabla: clientes

| Campo       | Descripción                |
|-------------|----------------------------|
| id (PK)     | Identificador único        |
| Nombre      | Nombre del cliente         |
| email       | Correo electrónico         |
| Contraseña  | Contraseña del cliente     |

### Tabla: profesionales

| Campo             | Descripción                              |
|-------------------|------------------------------------------|
| Id (PK)           | Identificador único                      |
| nombre            | Nombre del profesional                   |
| email             | Correo electrónico del profesional       |
| Tipo de servicio  | Tipo de servicio ofrecido por el profesional |
| Contraseña        | Contraseña del profesional               |
| Imagen            | URL de la foto de perfil del profesional |
| Provincia         | Provincia en donde se encuentra el profesional |

### Tabla: guardados

| Campo             | Descripción                              |
|-------------------|------------------------------------------|
| Id (PK)           | Identificador único                      |
| id_cliente (FK)   | Identificador del cliente que guardó el perfil como favorito |
| id_profesional (FK)| Identificador del profesional cuyo perfil fue guardado como favorito por el cliente |

### Tabla: reseña

| Campo             | Descripción                              |
|-------------------|------------------------------------------|
| Id (PK)           | Identificador único                      |
| id_cliente (FK)   | Identificador del cliente que hizo la reseña |
| id_profesional (FK)| Identificador del profesional que recibió la reseña |
---

### Interfaces de la App

Inicio de App
<img src="https://github.com/Andie7bhadie/Happy_paws/blob/main/interfaces/inicio.PNG" alt="Inicio de App">
Login
<img src="https://github.com/Andie7bhadie/Happy_paws/blob/main/interfaces/login.PNG" alt="Login">
Page Not Found
<img src="https://github.com/Andie7bhadie/Happy_paws/blob/main/interfaces/ruta incorrecta.PNG" alt="Ruta incorrecta">
Perfil profesional
<img src="https://github.com/Andie7bhadie/Happy_paws/blob/main/interfaces/perfil profesional.PNG" alt="Perfil profesional">
Perfil cliente
<img src="https://github.com/Andie7bhadie/Happy_paws/blob/main/interfaces/cartas profesionales.PNG" alt="Perfil cliente">
Perfil administrador
<img src="https://github.com/Andie7bhadie/Happy_paws/blob/main/interfaces/admin.PNG" alt="Perfil administrador">

 
