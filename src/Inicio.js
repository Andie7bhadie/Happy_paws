import {Link} from './Link.js'
import logo from './img/Happy_Paws_patas.png';
import logo2 from './img/Happy_Paws_circulo.png';
import foto2 from './img/foto_2.jpg';
import foto3 from './img/foto_3.jpg';
import foto4 from './img/foto_4.jpg';
import  './App.css';


function Inicio() {
  return (

    <div className="App">
      
      <header className="App-header">
      
        <div className='barra'>
        <img src={logo} className="logo1" alt="logo" />
        <Link to='/Login'>Login</Link>
        
        </div>
      </header>
         
     
     <div className='contenido'>
      <div className='scroll_fotos'>
      
      <img src={logo2} className="logo2" alt="logo2" />
      <p className='frase'>
        "Para cuidar a tu mejor amigo"
      </p>
      <img src={foto2} className="foto" alt="foto2" />
      <img src={foto3} className="foto" alt="foto3" />
      <img src={foto4} className="foto" alt="foto4" />
      </div>
      <div className='texto'>
      <p className='texto _informativo'>
        Somos una empresa que se encarga de hacer que los profesionales
        de distintas áreas del cuidado animal se promocionen y puedas contratar
        los servicios que necesitas para tu peludo.<br />
        ¡Manos a la obra!
      </p>
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
}

export default Inicio;
