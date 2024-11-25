

document.addEventListener('DOMContentLoaded', () => {
    const botonActualizar = document.getElementById('botonActualizar');

    // Escuchar el evento click del botón "Actualizar"
    botonActualizar.addEventListener('click', async (event) => {
        event.preventDefault(); // Evitar el comportamiento de envío predeterminado
        
        const formData = new FormData(document.getElementById('formCliente'));
        const id = document.getElementById('id').value; // Obtener el ID del cliente desde el formulario
        console.log('ID', id)
        try {
            console.log('Enviando solicitud de actualización');
            const response = await fetch(`/actualizarCliente/${id}`, {
                method: 'POST', 
                body: new URLSearchParams(formData), // Envía los datos en formato URL
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                credentials: 'same-origin'
            });
            console.log('Código de estado de la respuesta:', response.status);
            if (response.ok) {
                const result = await response.json();
                console.log('Resultado de la actualización:', result);
                alert(result.message);
                window.location.href = '/';  // Redirige a la página principal

            } else {
                alert('Error al actualizar el cliente');
                console.error('Error en la respuesta del servidor:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la actualización del cliente:', error);
        }
    });
});
