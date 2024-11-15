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
                    // Muestra el contenedor de sugerencias
                    contenedorCLientes.style.display = 'grid';

                    clientes.forEach((cliente, index) => {
                        const clienteDiv = document.createElement('div');
                        clienteDiv.classList.add('suggestion-item');
                        clienteDiv.textContent = cliente.nombre;
                        clienteDiv.dataset.id = cliente.id;  // Asigna el id al data-id
                        clienteDiv.dataset.index = index;  // Asigna el índice para el seguimiento

                        // Escuchar click en cada cliente
                        clienteDiv.addEventListener('click', () => {
                            inputNombre.value = cliente.nombre;  // Asigna nombre al input
                            contenedorCLientes.innerHTML = '';  // Limpia contenedor
                            contenedorCLientes.style.display = 'none';  // Oculta el contenedor al seleccionar un cliente
                            fetchRmaData(clienteDiv.dataset.id);
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
            contenedorCLientes.style.display = 'none';  // Ocultar contenedor si hay menos de 2 caracteres
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
            contenedorCLientes.innerHTML = '';  // Limpiar contenedor
            contenedorCLientes.style.display = 'none';  // Ocultar contenedor
            selectedIndex = -1;  // Reiniciar índice
            event.preventDefault();
            fetchRmaData(selectedDiv.dataset.id);
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
    // Realiza fetch a los datos de RMA y los muestra en el contenedor
    async function fetchRmaData(idCliente) {
        try {
            const response = await fetch(`/getRmaCliente/${idCliente}`);
            const rmaData = await response.json();
            const contenedorDeRma = document.getElementById('contenedorDeRma');
            contenedorDeRma.innerHTML = ''; // Limpiar el contenedor antes de mostrar nuevos resultados
            
            if (rmaData.message) {
                alert(rmaData.message); // Mostrar alerta si no hay datos
            } else {
                // Crear tabla para los datos
                const table = document.createElement('table');
                table.classList.add('rma-table');

                // Crear encabezado con los títulos
                const headerRow = document.createElement('tr');
                const titles = [
                    'Modelo', 'Cantidad', 'Marca', 'Solicita', 'OpLote', 'Vencimiento',
                    'Se Entrega', 'Se Recibe', 'Observaciones', 'Número de Ingreso', 'Número de Egreso', 'Acción'
                ];
                titles.forEach((title) => {
                    const th = document.createElement('th');
                    th.textContent = title;
                    headerRow.appendChild(th);
                });
                table.appendChild(headerRow);

                // Crear filas para cada producto
                rmaData.forEach((rma) => {
                    const row = document.createElement('tr');

                    // Formatear las fechas
                    const formatDate = (date) => {
                        if (!date) return ''; // Si la fecha es null, devuelve vacío
                        const d = new Date(date);
                        const day = String(d.getDate()).padStart(2, '0');
                        const month = String(d.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
                        const year = d.getFullYear();
                        return `${day}/${month}/${year}`;
                    };

                    // Agregar celdas con datos
                    const values = [
                        rma.modelo || '', rma.cantidad || '', rma.marca || '',
                        formatDate(rma.solicita), rma.opLote || '', formatDate(rma.vencimiento),
                        formatDate(rma.seEntrega), formatDate(rma.seRecibe),
                        rma.observaciones || '', rma.nIngreso || '', rma.nEgreso || ''
                    ];

                    values.forEach((value) => {
                        const td = document.createElement('td');
                        td.textContent = value;
                        row.appendChild(td);
                    });

                    // Crear la celda con el botón de actualización
                    const actionCell = document.createElement('td');
                    const updateButton = document.createElement('input');
                    updateButton.type = 'button';
                    updateButton.value = 'Actualizar'
                    updateButton.classList.add('update-button');
                    actionCell.appendChild(updateButton);
                    row.appendChild(actionCell);

                    table.appendChild(row);
                });
                contenedorDeRma.appendChild(table);
            }
        } catch (error) {
            console.error('Error al obtener datos de RMA:', error);
        }
    }

});



