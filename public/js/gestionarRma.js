 const direccionActual = window.location.pathname;
 if (direccionActual === '/gestionarRma') {
     const h1 = document.getElementById('tituloCargar');
     h1.innerHTML = '';
     h1.insertAdjacentHTML('beforeend', 'Gestionar Rma');
}

async function cargarProductos(idCliente, nombreCliente) {
    try {
        const response = await fetch(`/listarProductosRma/${idCliente}`);
        const productos = await response.json();

        const productosTableBody = document.getElementById('productosTableBody');
        productosTableBody.innerHTML = ''; // Limpiar tabla antes de llenarla

        if (productos.length > 0) {
            document.getElementById('formProductos').style.display = 'grid';
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
                    <td><button type="button" class="botonActualizar" data-id="${producto.idRma}">Actualizar</button></td>
                    <td><button type="button" onclick="eliminarProducto(${producto.idRma})" class="botonEliminar">Eliminar</button></td>
                `;

                productosTableBody.appendChild(row);

                const inputs = row.querySelectorAll('input');
                const rowId = row.dataset.id;
                originalData[rowId] = Array.from(inputs).reduce((acc, input) => {
                    acc[input.name] = input.value.trim() === '' ? null : input.value;
                    return acc;
                }, {});
            });

        } else {
            if (nombreCliente) {
                alert(`El cliente ${nombreCliente} no tiene productos asociados.`);
            } else {
                console.error('Error: nombreCliente no está definido.');
            }
            document.getElementById('formProductos').style.display = 'none';
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}




document.addEventListener('DOMContentLoaded', () => {
    const clienteSearch = document.getElementById('clienteSearch');
    const suggestionsContainer = document.getElementById('suggestionsContainer1');
    const productosContainer = document.getElementById('productosContainer');
    const productosTableBody = document.getElementById('productosTableBody');
    const botonCargar = document.getElementById('botonCargar');

    botonCargar.disabled = true; // Inicializar el botón como deshabilitado

    let highlightedIndex = -1; // Índice del elemento resaltado
    let clientes = []; // Almacena la lista de clientes
    let filteredClientes = []; // Almacena la lista filtrada de clientes

    const rutaActual = window.location.pathname;

    clienteSearch.addEventListener('input', async () => {
        const query = clienteSearch.value.trim();
        
        // Limpiar la tabla de productos cuando se empieza a buscar un cliente nuevo
        limpiarTablaProductos();

        try {
            const response = await fetch(`/listarClientesRma`);
            clientes = await response.json(); // Guarda la lista de clientes
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.style.display = 'block';

            filteredClientes = clientes.filter(cliente => 
                cliente.nombre && typeof cliente.nombre === 'string' && cliente.nombre.toLowerCase().includes(query.toLowerCase())
            );

            filteredClientes.forEach(cliente => {
                const suggestion = document.createElement('div');
                suggestion.classList.add('suggestion-item');
                suggestion.textContent = cliente.nombre;

                suggestion.addEventListener('click', () => {
                    selectCliente(cliente); // Llama a la función para seleccionar el cliente
                });

                suggestionsContainer.appendChild(suggestion);
            });
            
        } catch (error) {
            console.error('Error fetching clientes:', error);
        }
    });

    // Manejar la navegación con flechas y selección
    clienteSearch.addEventListener('keydown', (e) => {
        const suggestionItems = document.querySelectorAll('.suggestion-item');
        if (e.key === 'ArrowDown') {
            highlightedIndex = (highlightedIndex + 1) % suggestionItems.length;
            updateHighlight(suggestionItems);
            e.preventDefault(); // Evitar el desplazamiento de la página
        } else if (e.key === 'ArrowUp') {
            highlightedIndex = (highlightedIndex - 1 + suggestionItems.length) % suggestionItems.length;
            updateHighlight(suggestionItems);
            e.preventDefault(); // Evitar el desplazamiento de la página
        } else if (e.key === 'Enter') {
            if (highlightedIndex >= 0 && suggestionItems[highlightedIndex]) {
                selectCliente(filteredClientes[highlightedIndex]); // Seleccionar el cliente resaltado de la lista filtrada
            }
        }
    });

    const updateHighlight = (items) => {
        items.forEach((item, index) => {
            if (index === highlightedIndex) {
                item.classList.add('highlighted'); // Agregar clase para resaltar
                item.scrollIntoView({ block: 'nearest' }); // Desplazar para mostrar el resaltado
            } else {
                item.classList.remove('highlighted'); // Remover resaltado
            }
        });
    };

    const selectCliente = (cliente) => {
        clienteSearch.value = cliente.nombre; // Poner el nombre en el input
        document.getElementById('idCliente').value = cliente.id;  // Guarda el ID del cliente seleccionado en el campo oculto
        suggestionsContainer.style.display = 'none';

        if (rutaActual === '/agregarRma') {
            document.querySelectorAll('.campoOculto').forEach(campo => {
                campo.classList.remove('campoOculto'); // Eliminar la clase que oculta los campos
            });
        }

        if (rutaActual === '/gestionarRma') {
            cargarProductos(cliente.id, cliente.nombre); // Pasar el nombre del cliente también
        }
    };

    document.addEventListener('click', (e) => {
        if (!suggestionsContainer.contains(e.target) && e.target !== clienteSearch) {
            suggestionsContainer.style.display = 'none';
        }
    });

    function limpiarTablaProductos() {
        productosTableBody.innerHTML = ''; // Limpia el contenido de la tabla
        document.getElementById('formProductos').style.display = 'none'; // Oculta el formulario
    }
});


// Escuchar los cambios y actualizar
let originalData = {};

document.addEventListener('DOMContentLoaded', () => {
    const productosTableBody = document.getElementById('productosTableBody');

    // Guardar los datos originales de todas las filas
    const filas = productosTableBody.querySelectorAll('tr');
    filas.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const rowId = row.dataset.id;
        originalData[rowId] = Array.from(inputs).reduce((acc, input) => {
            acc[input.name] = input.value.trim() === '' ? null : input.value;
            return acc;
        }, {});
    });

    // Escucha eventos de clic en los botones de actualizar
    productosTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('botonActualizar')) {
            const button = event.target;
            const row = button.closest('tr');
            if (!row) return;

            const idRma = button.dataset.id;
            const inputs = row.querySelectorAll('input');

            const datosFila = Array.from(inputs).reduce((acc, input) => {
                acc[input.name] = input.value.trim() === '' ? null : input.value;
                return acc;
            }, {});

            actualizarProducto(idRma, datosFila);
        }
    });
});

// Función para actualizar producto en el servidor
async function actualizarProducto(idRma, datosFila) {
    const originalRowData = originalData[idRma];
    const isChanged = Object.keys(datosFila).some(key => datosFila[key] !== originalRowData[key]);

    if (!isChanged) {
        return;
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




