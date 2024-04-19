import { Link } from './Link';
import  './App.css';

export default function Page404 () {
  return (
    <>
      <div className='container_perro'>
        <h1>This is NOT fine</h1>
        <div className='imagen_perro'>
        <img  src='https://pbs.twimg.com/media/Ezn3Fs3XoAU5SXs.jpg' 
        alt='Perro de This is Fine quemándose vivo' width="400" height="350" />
        </div>
      </div>
      <Link  to='/Inicio'>Inicio</Link>
    </>
  )
}