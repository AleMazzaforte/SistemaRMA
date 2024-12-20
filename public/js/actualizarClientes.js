document.addEventListener('DOMContentLoaded', () => {
    const botonActualizar = document.getElementById('botonActualizar');
    const botonEliminar = document.getElementById('botonEliminar'); // Agregado para eliminar

    botonActualizar.addEventListener('click', async (event) => {
        event.preventDefault();

        const id = document.getElementById('id').value;
        const nombre = document.getElementById('nombre').value;
        const cuit = document.getElementById('cuit').value;
        const provincia = document.getElementById('provincia').value;
        const ciudad = document.getElementById('ciudad').value;
        const domicilio = document.getElementById('domicilio').value;
        const telefono = document.getElementById('telefono').value;
        const transporte = document.getElementById('transporte').value;
        const seguro = document.getElementById('seguro').value;
        const condicionDeEntrega = document.getElementById('condicionDeEntrega').value;
        const condicionDePago = document.getElementById('pago').value;
        const telefonoInput = telefono.trim() || null;
        try {
            const response = await fetch(`/actualizarCliente/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre,
                    cuit,
                    provincia,
                    ciudad,
                    domicilio,
                    telefono: telefonoInput,
                    transporte,
                    seguro,
                    condicionDeEntrega,
                    condicionDePago
                }),
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.message) { 
                    alert(result.message); // Muestra el mensaje del servidor
                    location.reload(); // Recarga la página
                } else {
                    console.error('Respuesta sin mensaje:', result);
                    alert('Error: no se recibió un mensaje de confirmación');
                }
            } else {
                console.error('Error al actualizar:', response.statusText);
                alert('Error al actualizar el cliente');
            }
            
        } catch (error) {
            console.error('Error al actualizar cliente:', error);
            alert('Error al actualizar cliente');
        }
    });

    botonEliminar.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevenir comportamiento por defecto del formulario
        const id = document.getElementById('id').value;

        try {
            const response = await fetch(`/eliminarCliente/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Cliente eliminado correctamente');
                // Aquí puedes añadir lógica para actualizar la interfaz después de eliminar el cliente
                location.reload(); // Recarga la página para reflejar los cambios
            } else {
                alert('Error al eliminar el cliente');
            }
        } catch (error) {
            console.error('Error al eliminar el cliente:', error);
            alert('Error al eliminar el cliente');
        }
    });
});
