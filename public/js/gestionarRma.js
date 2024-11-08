

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
                
                productos.forEach((producto, index) => {
                     
                const formatDate = date => {
                    const [day, month, year] = date.split('/');
                    return `${year}-${month}-${day}`;
                };

                const row = document.createElement('tr');
                
                row.dataset.id = producto.idRma; // Colocar idRma en el dataset de la fila
                row.innerHTML = `
                    
                    <td><input type="text" value="${producto.modelo}" name="modelo" /></td>
                    <td><input type="number" value="${producto.cantidad}" name="cantidad" /></td>
                    <td><input type="text" value="${producto.marca}" name="marca" /></td>
                    <td><input type="date" value="${producto.solicita ? formatDate(producto.solicita) : ''}" name="solicita" /></td>
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

            // Evento para detectar cambios en las celdas
            const inputs = productosTableBody.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    document.getElementById('botonActualizarRma').style.display = 'grid';
                });
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
    
    // Almacena los cambios para actualizarlos de una sola vez
    const cambiosPendientes = new Map();

    // Detecta cambios en los inputs y habilita el botón de actualización
    productosTableBody.addEventListener('input', (event) => {
        const fila = event.target.closest('tr');
        const idRma = fila.dataset.id;
        const campo = event.target.name;
        const valor = event.target.value;

        // Registrar cambio en el campo modificado
        if (!cambiosPendientes.has(idRma)) {
            cambiosPendientes.set(idRma, {});
        }
        cambiosPendientes.get(idRma)[campo] = valor;

        // Mostrar botón de actualización
        botonActualizarRma.style.display = 'inline-block';
    });

    // Evento para enviar los cambios
    botonActualizarRma.addEventListener('click', async () => {
        let actualizacionesExitosas = true;
        for (let [idRma, cambios] of cambiosPendientes) {
            
            try { 
                const response = await fetch(`/actualizarProductoRma/${idRma}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cambios)
                });
                
                if (!response.ok) throw new Error('Error al actualizar el producto');
                cambiosPendientes.delete(idRma);
            } catch (error) {
                console.error(`Error al actualizar producto ${idRma}:`, error);
                actualizacionesExitosas = false;
            }
        }
        if (actualizacionesExitosas) {
            alert('Los productos han sido actualizados correctamente.');
        } else {
            alert('Hubo un error al actualizar algunos productos.');
        }
        botonActualizarRma.style.display = 'none';
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




