import './App.css';
import Inicio from './Inicio';
import Perfil_Profesional from './Perfil_Profesional';
import Perfil_Usuario from './Perfil_Usuario';
import Perfil_administrador from './Perfil_administrador';
import Login from './Login';
import {Router} from './Router';



//extraemos las rutas que tenemos
const routes=[
  {
    path:'/Inicio',
    Component:Inicio
  },{
    path:'/Login',
    Component:Login
  },{
    path:'/Perfil_Profesional',
    Component:Perfil_Profesional
  },{
    path:'/Perfil_administrador',
    Component:Perfil_administrador
  },{
    path:'/Perfil_Usuario',
    Component:Perfil_Usuario
  }


]


function App() {


   return (
    <main>
    
        <Router routes={routes}/>
  </main>
  
  );
}

export default App;
