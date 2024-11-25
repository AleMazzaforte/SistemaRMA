const direccionActual = window.location.pathname;
if (direccionActual === '/gestionarRma') {
    const h1 = document.getElementById('tituloCargar');
    h1.innerHTML = '';
    h1.insertAdjacentHTML('beforeend', 'Gestionar Rma');
}

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
                    <td><input type="number" value="${producto.nIngreso}" name="nIngreso" /></td>
                    <td><input type="number" value="${producto.nEgreso}" name="nEgreso" /></td>
                    <td><button type="button" class="botonActualizar" data-id="${producto.idRma}">Actualizar</button></td>
                    <td><button type="button" onclick="eliminarProducto(${producto.idRma})" class= 'botonEliminar'>Eliminar</button></td>
                `;
                productosTableBody.appendChild(row);

                // Al cargar el producto, guarda los datos originales de la fila
                const inputs = row.querySelectorAll('input');
                const rowId = row.dataset.id; // El ID del producto
                originalData[rowId] = Array.from(inputs).reduce((acc, input) => {
                    acc[input.name] = input.value.trim() === '' ? null : input.value;
                    return acc;
                }, {});

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

//escuchar los cambios y actualizar
let originalData = {}
document.addEventListener('DOMContentLoaded', () => {
    const productosTableBody = document.getElementById('productosTableBody');

     // Objeto global para almacenar los datos originales de cada fila
      

     // Al cargar la página, guardar los datos originales de todas las filas
     const filas = productosTableBody.querySelectorAll('tr');
     filas.forEach(row => {
         const inputs = row.querySelectorAll('input');
         const rowId = row.dataset.id; // Suponiendo que cada fila tiene un atributo data-id con el ID del producto
 
         
     });
     
    // Escucha eventos de clic en los botones de actualizar
    productosTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('botonActualizar')) {
            const button = event.target;
            const row = button.closest('tr'); // Obtener la fila donde está el botón
            if (!row) return;

            const idRma = button.dataset.id; // Obtener el ID del producto
            const inputs = row.querySelectorAll('input'); // Obtener los inputs de la fila

            

            // Construir un objeto con los datos de la fila
            const datosFila = Array.from(inputs).reduce((acc, input) => {
                acc[input.name] = input.value.trim() === '' ? null : input.value;
                return acc;
            }, {});

            // Llamar a la función actualizarProducto
            actualizarProducto(idRma, datosFila);
        }
    });
});


// Función para actualizar producto en el servidor
async function actualizarProducto(idRma, datosFila) {
    
     // Obtener los datos originales de la fila
     const originalRowData = originalData[idRma];
     // Comparar los datos actuales con los originales
     const isChanged = Object.keys(datosFila).some(key => datosFila[key] !== originalRowData[key]);
 
     if (!isChanged) {
         return; // Si no hay cambios, no hacer nada
     }

    try {
        const response = await fetch(`/actualizarProductoRma/${idRma}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosFila),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar producto.');
        }

        alert('Producto actualizado con éxito.');
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        alert('Hubo un error al actualizar el producto.');
    }
}



// *************************************************************
//               Función para eliminar registros
// *************************************************************

async function eliminarProducto(idRma) {
    
    
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar este valor?");
    
    if (!confirmacion) {
        console.log("La acción de eliminación fue cancelada.");
        return; // Detén la ejecución si el usuario cancela
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




