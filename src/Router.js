 import { EVENTS } from "./Const"
 import Page404 from "./Page404"
 import { useState, useEffect } from "react"
 export function Router ({routes=[], defaultComponent : DefaultComponent =() => <Page404/>}){
    //Tenemos que escuchar cuando cambia la url
    const[currentPath,setCurrentPath]=useState(window.location.pathname)
    
    useEffect(()=>{
    const onLocationChange= ()=>{
    setCurrentPath(window.location.pathname)
    }
    
    window.addEventListener(EVENTS.PUSHSTATE,onLocationChange)//escuchamos el evento
    window.addEventListener(EVENTS.POPSTATE,onLocationChange)//escuchamos el evento cuando se navega hacia atrás
    //popstate es el evento que suelta el navegador cuando navegamos hacia atrás
    return () =>{//limpiamos el evento de navegar hacia alante y hacia atrás
    window.removeEventListener(EVENTS.PUSHSTATE,onLocationChange)}
    window.removeEventListener(EVENTS.POPSTATE,onLocationChange)
    },[]) 
         
    //el componente que tenemos que renderizar
    //iteramos el array de rutas para encontrar la ruta igual a la ruta actual que tenemos en el estado.
    const Page=routes.find(({path})=>path===currentPath)?.Component
    
    return Page ? <Page/>: <DefaultComponent/>
    
    }