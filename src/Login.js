import { Link } from './Link.js'; 
import './App.css';
import React from 'react';
import FormularioLog from './Formulario.js'; 
import FormularioLog2 from './Formulario_Pro.js';
import logo from './img/Happy_Paws_patas.png';
import FormularioRes from './FormularioRes.js'; 


function Login() { 

  return (
    <div className="login-container"> 
      <div className="barra">
        <img src={logo} className="logo1" alt="logo" />
        <Link to="/Inicio">Inicio</Link>
        
        
      </div>
      <div className="formularios">
        <div className="form1">
          <p>Inicio de sesión:</p>
          <h1>USUARIOS</h1>
          <FormularioLog   /> 
         
        </div>
        <div className="form2"> 
          <p>Inicio de sesión:</p>
          <h1>PROFESIONALES</h1>
          <FormularioLog2  />
          
        </div>
        
      </div>
      <div className="form3">
          <h1>REGISTRATE:</h1>
         
          <FormularioRes  />
          
        </div>
    </div>
  );
}

export default Login;







