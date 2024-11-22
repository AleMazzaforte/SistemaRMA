async function cargarProductos(idCliente) {
    try {  
        const response = await fetch(`/listarProductosRma/${idCliente}`);
        const productos = await response.json();
        
        const productosTableBody = document.getElementById('productosTableBody');
        productosTableBody.innerHTML = ''; // Limpiar tabla antes de llenarla

        // Verifica si hay productos asociados
        if (productos.length > 0) {
            // Mostrar el formulario
            document.getElementById('formProductos').style.display = 'grid';

            // Llenar la tabla con los datos de los productos
            productos.forEach((producto) => {
                const formatDate = date => {
                    const [day, month, year] = date.split('/');
                    return `${year}-${month}-${day}`;
                };

                const row = document.createElement('tr');
                row.dataset.id = producto.idRma; // Colocar idRma en el dataset de la fila
                row.innerHTML = `
                    <td><input type="text" value="${producto.modelo}" name="modelo" readonly /></td>
                    <td><input type="number" value="${producto.cantidad}" name="cantidad" readonly /></td>
                    <td><input type="text" value="${producto.marca}" name="marca" readonly /></td>
                    <td><input type="date" value="${producto.solicita ? formatDate(producto.solicita) : ''}" name="solicita" readonly /></td>
                    <td><input type="text" value="${producto.opLote}" name="opLote" /></td>
                    <td><input type="date" value="${producto.vencimiento ? formatDate(producto.vencimiento) : ''}" name="vencimiento" /></td>
                    <td><input type="date" value="${producto.seEntrega ? formatDate(producto.seEntrega) : ''}" name="seEntrega" /></td>
                    <td><input type="date" value="${producto.seRecibe ? formatDate(producto.seRecibe) : ''}" name="seRecibe" /></td>
                    <td><input type="text" value="${producto.observaciones}" name="observaciones" /></td>
                    <td><input type="text" value="${producto.nIngreso}" name="nIngreso" /></td>
                    <td><input type="text" value="${producto.nEgreso}" name="nEgreso" /></td>
                    <td><button type="button" onclick="eliminarProducto(${producto.idRma})">Eliminar</button></td>
                `;
                productosTableBody.appendChild(row);
            });

        } else { 
            alert('El cliente seleccionado no tiene productos asociados.');
            // Ocultar el formulario si no hay productos
            document.getElementById('formProductos').style.display = 'none';
            clienteSearch.value = '';
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const productosTableBody = document.getElementById('productosTableBody');
    const botonActualizarRma = document.getElementById('botonActualizarRma');
    
    const cambiosPendientes = new Map();

    // Detecta cambios en los inputs y almacena toda la fila en cambiosPendientes
    productosTableBody.addEventListener('input', (event) => {
        const fila = event.target.closest('tr');
        const idRma = fila.dataset.id;

        // Captura todos los valores de la fila
        const inputs = fila.querySelectorAll('input');
        const filaCompleta = {};
        inputs.forEach(input => {
            filaCompleta[input.name] = input.value === '' ? null:input.value;
        });
        console.log('CAMBIOS PENDIENTES', cambiosPendientes)
        // Almacena toda la fila en cambiosPendientes
        cambiosPendientes.set(idRma, filaCompleta);

        // Muestra el botón de actualización
        botonActualizarRma.style.display = 'inline-block';
    });

    // Evento para enviar los cambios
    botonActualizarRma.addEventListener('click', async () => {
        let actualizacionesExitosas = true; // Bandera para verificar el estado de todas las actualizaciones
    
        for (let [idRma, datosFila] of cambiosPendientes) {
            try {
                const response = await fetch(`/actualizarProductoRma/${idRma}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosFila),
                });
    
                if (!response.ok) throw new Error('Error al actualizar el producto');
                
                // Si se actualiza correctamente, eliminar de cambios pendientes
                cambiosPendientes.delete(idRma);
            } catch (error) {
                console.error(`Error al actualizar producto ${idRma}:`, error);
                actualizacionesExitosas = false; // Marcar como fallo en caso de error
            }
        }
    
        // Mostrar mensajes dependiendo del resultado de las actualizaciones
        if (actualizacionesExitosas) {
            alert('Los productos han sido actualizados correctamente.');
            // Recargar la tabla con los datos actualizados
            const idCliente = document.getElementById('idCliente').value;
            cargarProductos(idCliente);
        } else {
            alert('Hubo un error al actualizar algunos productos.');
        }
    
        // Ocultar el botón si no quedan cambios pendientes
        if (cambiosPendientes.size === 0) {
            botonActualizarRma.style.display = 'none';
        }
    });
    
});


// *************************************************************
//               Función para eliminar registros
// *************************************************************

async function eliminarProducto(idRma) {
    

    if (!idRma) {
        console.error('ID de producto no proporcionado');
        return;
    }

    try {
        
        const response = await fetch(`/eliminarProductoRma/${idRma}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        
        if (!response.ok) throw new Error('Error al eliminar el producto');
        
        // Selecciona el elemento correctamente, usando data-idRma
        const rowElement = document.querySelector(`tr[data-id="${idRma}"]`);
        if (rowElement) {
            rowElement.remove();
            alert('Producto eliminado exitosamente.');
        } else {
            console.warn(`No se encontró ningún elemento en la tabla con ID: ${idRma}`);
        }
        
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        alert('Hubo un error al eliminar el producto.');
    }
}




