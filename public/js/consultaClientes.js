

document.addEventListener('DOMContentLoaded', () => {
    const inputNombre = document.getElementById('nombre');
    const contenedorCLientes = document.getElementById('contenedorCLientes');
    let selectedIndex = -1;  // Índice para seguimiento de selección

    // Escuchar el evento de input para realizar la búsqueda
    inputNombre.addEventListener('input', async (event) => {
        const nombre = event.target.value;
        selectedIndex = -1;  // Reiniciar la selección al cambiar el valor del input

        if (nombre.length >= 2) {
            try {
                const response = await fetch(`/buscarCliente?nombre=${encodeURIComponent(nombre)}`);
                const clientes = await response.json();

                // Limpiar el contenedor antes de mostrar nuevos resultados
                contenedorCLientes.innerHTML = '';

                if (clientes.length > 0) {
                    clientes.forEach((cliente, index) => {
                        const clienteDiv = document.createElement('div');
                        clienteDiv.classList.add('suggestion-item');
                        clienteDiv.textContent = cliente.nombre;
                        clienteDiv.dataset.id = cliente.id;  // Asigna el id al data-id
                        clienteDiv.dataset.index = index;  // Asigna el índice para el seguimiento

                        // Escuchar click en cada cliente
                        clienteDiv.addEventListener('click', () => {
                            inputNombre.value = cliente.nombre;  // Asigna nombre al input
                            console.log('ID del cliente seleccionado:', clienteDiv.dataset.id);  // Muestra el id en consola
                            contenedorCLientes.innerHTML = '';  // Limpia contenedor
                        });

                        contenedorCLientes.appendChild(clienteDiv);
                    });
                } else {
                    contenedorCLientes.innerHTML = '<p>No se encontraron clientes</p>';
                }
            } catch (error) {
                console.error('Error al buscar clientes:', error);
            }
        } else {
            contenedorCLientes.innerHTML = '';  // Limpiar resultados si hay menos de 2 caracteres
        }
    });

    // Event listener para las teclas de flechas y Enter
    inputNombre.addEventListener('keydown', (event) => {
        const suggestionItems = document.querySelectorAll('.suggestion-item');

        if (event.key === 'ArrowDown') {
            // Bajar en la lista
            if (selectedIndex < suggestionItems.length - 1) {
                selectedIndex++;
                updateSelection(suggestionItems);
            }
            event.preventDefault();
        } else if (event.key === 'ArrowUp') {
            // Subir en la lista
            if (selectedIndex > 0) {
                selectedIndex--;
                updateSelection(suggestionItems);
            }
            event.preventDefault();
        } else if (event.key === 'Enter' && selectedIndex > -1) {
            // Seleccionar elemento actual
            const selectedDiv = suggestionItems[selectedIndex];
            inputNombre.value = selectedDiv.textContent;
            console.log('ID del cliente seleccionado:', selectedDiv.dataset.id);  // Muestra el id en consola
            contenedorCLientes.innerHTML = '';  // Limpiar contenedor
            selectedIndex = -1;  // Reiniciar índice
            event.preventDefault();
        }
    });

    // Función para actualizar la selección visual
    function updateSelection(items) {
        items.forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // Realiza fetch a los datos de RMA y los muestra en el contenedor
    async function fetchRmaData(idCliente) {
        
        try {
            const response = await fetch(`/getRmaCliente?idCliente=${idCliente}`);
            const rmaData = await response.json();

            contenedorDeRma.innerHTML = '';  // Limpiar el contenedor antes de mostrar nuevos resultados

            if (rmaData.message) {
                alert(rmaData.message);  // Mostrar alerta si no hay datos
            } else {
                rmaData.forEach((rma) => {
                    const rmaDiv = document.createElement('div');
                    rmaDiv.classList.add('rma-item');  // Clase para diseño en grid
                    rmaDiv.innerHTML = `
                        <div>Modelo: ${rma.modelo}</div>
                        <div>Cantidad: ${rma.cantidad}</div>
                        <div>Marca: ${rma.marca}</div>
                        <div>Solicita: ${rma.solicita}</div>
                        <div>OpLote: ${rma.opLote}</div>
                        <div>Vencimiento: ${rma.vencimiento}</div>
                        <div>Se Entrega: ${rma.seEntrega}</div>
                        <div>Se Recibe: ${rma.seRecibe}</div>
                        <div>Observaciones: ${rma.observaciones}</div>
                        <div>Número de Ingreso: ${rma.nIngreso}</div>
                        <div>Número de Egreso: ${rma.nEgreso}</div>
                    `;
                    contenedorDeRma.appendChild(rmaDiv);
                });
            }
        } catch (error) {
            console.error('Error al obtener datos de RMA:', error);
        }
    }
});



