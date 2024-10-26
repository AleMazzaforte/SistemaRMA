

document.addEventListener('DOMContentLoaded', () => {
    const botonActualizar = document.getElementById('botonActualizar');

    // Escuchar el evento click del botón "Actualizar"
    botonActualizar.addEventListener('click', async (event) => {
        console.log('Botón actualizar clickeado antes de prevent');
        event.preventDefault(); // Evitar el comportamiento de envío predeterminado
        console.log('Botón actualizar clickeado');
        const formData = new FormData(document.getElementById('formCliente'));

        try {
            console.log('Enviando solicitud de actualización');
            const response = await fetch('/actualizarCliente', {
                method: 'POST',
                body: new URLSearchParams(formData), // Envía los datos en formato URL
                credentials: 'same-origin'
            });
            console.log('Respuesta recibida:', response);
            if (response.ok) {
                const result = await response.json()
                console.log('Resultado de la actualización:', result);
                alert(result.message);
                window.location.href = '/'; 
            } else {
                alert('Error al actualizar el cliente');
                console.error('Error en la respuesta del servidor:', response.statusText); // Log para detalles de error
            }
        } catch (error) {
            console.error('Error en la actualización del cliente:', error);
            console.log({error})
        }
    });
});
