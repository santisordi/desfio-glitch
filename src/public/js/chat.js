const socket = io();
const botonChat = document.getElementById('botonChat');
const parraforsMensajes = document.getElementById('parraforsMensajes');
const valInput = document.getElementById('chatBox');

let user
 
//ahora generamos el usuario para identificarnos

Swal.fire ({
    title: "Identificacion de usuario",
    text: "Por favor ingrese su nombre de usuario",
    input: "text",
    inputValidator:(valor)=>{
        return !valor && "Ingrese un nombre de usuario valido"
    },
    allowOutsideClick: false
}).then(resultado =>{
      user = resultado.value
      console.log(user)
});

botonChat.addEventListener('click', ()=>{
    let fechaActual = new Date().toLocaleString();
    if(valInput.value.trim().length > 0){ //evito el msj vacio
        socket.emit('mensaje', { fecha:fechaActual,  user:user, mensaje:valInput.value});
        valInput.value = ""; //limpio el input
    }
})

socket.on('mensajes', arrayMensajes => {
    parraforsMensajes.innerHTML = ""  //limpio el html
    arrayMensajes.forEach(mensaje => {
        parraforsMensajes.innerHTML +=`<p>${mensaje.fecha} : ${mensaje.user} escribio: ${mensaje.mensaje}</p>`;
               
    }); 
})