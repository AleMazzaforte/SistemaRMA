document.addEventListener("DOMContentLoaded", function() {
    const idTransporte = document.getElementById("idTransporte").value;
    
    if (idTransporte) {
        // Inyectamos el ID en los botones para "Actualizar" y "Eliminar"
        const botonActualizar = document.getElementById("botonActualizar");
        const botonEliminar = document.getElementById("botonEliminar");
        
        // Actualizamos el action del formulario con el id dinámicamente
        botonActualizar.formAction = `/actualizarTransporte/${idTransporte}`;
        botonEliminar.formAction = `/eliminarTransporte/${idTransporte}`;
        
        
    } 
});