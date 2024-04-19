import { EVENTS } from "./Const"
//Esto nos ayudará con problemas de accesibilidad d ela página, 
//para que detecte los ancore y permita la navegacion con teclado.
export function navigate(href) {//cambiamos url de la barra
    window.history.pushState({}, '', href)
    //crear evento personalizado para navegar
    const navigateEvent = new Event(EVENTS.PUSHSTATE)//creamos un nuevo evento 
    window.dispatchEvent(navigateEvent)
}
//target por si queremos abrirlo en otra ventana , el a donde va y el resto de props, se lo pasamos al ancore
export function Link({ target, to, ...props }) {
    const handleClick = (event) => {//entre parentesis ponemos eso por que debe evitar su comportamiento por defecto
        
        //vemos si es el evento principal
        const isMainEvent = event.button === 0//click izq por los general
        //tenemos que observar si  se utiliza otro evento 
        const isModifiedEvent =event.MetaKey||event.altKey||event.ctrlKey||event.shiftKey
        
        //tenemos que ver si el target que se ha puesto es para que se abra en la misma ventana
        const isManageableEvent=target===undefined ||target==='_self'
        if (isMainEvent &&  isManageableEvent && !isModifiedEvent){
            //para evitar la navegación completa
        event.preventdefault()
        navigate(to)} //navegacion con single page
    }
    return <a onClick={handleClick} href={to} target={target} {...props} />
}
