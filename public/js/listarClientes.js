

document.addEventListener('DOMContentLoaded', () => {
    const formCliente = document.getElementById('formCliente');
    const editButton = document.getElementById('editButton');
    const clienteSearch = document.getElementById('clienteSearch');
    const suggestionsContainer = document.querySelector('#suggestionsContainer1');
    const botonCargar = document.getElementById('botonCargar');
    const botonActualizar = document.getElementById('botonActualizar');
    const botonEliminar = document.getElementById('botonEliminar');
    let clientes = [];
    
    // Ocultar el formulario y mostrar el buscador al hacer clic en Editar
    editButton.addEventListener('click', () => {
        formCliente.style.display = 'none';
        setTimeout(() => {
            clienteSearch.style.display = 'block'; // Muestra el buscador después del retraso
            clienteSearch.focus();
            fetchClientes();
        }, 200); 
    });

    // Obtener clientes de la base de datos
    async function fetchClientes() {
        try {
            const response = await fetch('/buscarCliente');
            clientes = await response.json();

        } catch (error) {
            console.error('Error al obtener clientes:', error);
        }
    }

    // Filtrar y mostrar coincidencias en tiempo real
    clienteSearch.addEventListener('input', () => {
        const searchTerm = clienteSearch.value.toLowerCase();
        const matches = clientes.filter(cliente =>
            cliente.nombre.toLowerCase().includes(searchTerm) ||
            cliente.id.toString().includes(searchTerm)
        );
        displaySuggestions(matches);
    });
    
    // Mostrar sugerencias de búsqueda
    function displaySuggestions(matches) {
        suggestionsContainer.innerHTML = '';
        setTimeout(() => {
            if (matches.length) {
                suggestionsContainer.style.display = 'block';
            } else {
                suggestionsContainer.style.display = 'none';
            }
        },  200);

        matches.forEach(cliente => {
            const suggestion = document.createElement('div');
            suggestion.insertAdjacentHTML('beforeend', `${cliente.nombre} (${cliente.id})`);
            suggestion.classList.add('suggestion-item');
            suggestion.addEventListener('click', () => selectCliente(cliente));
            suggestionsContainer.appendChild(suggestion);
            
        });
    }

    // Seleccionar cliente y cargar datos en el formulario
    function selectCliente(cliente) {
        
        clienteSearch.style.display = 'none';
        suggestionsContainer.style.display = 'none';
        editButton.style.display = 'none'
        botonCargar.style.display = 'none'
        botonActualizar.style.display = 'inline-block';
        botonEliminar.style.display = 'inline-block';
        setTimeout(() => {
            formCliente.style.display = 'grid';
            
            // Cargar los datos del cliente en el formulario
            document.getElementById('id').value = cliente.id;
            document.getElementById('nombre').value = cliente.nombre;
            document.getElementById('cuit').value = cliente.cuit;
            document.getElementById('provincia').value = cliente.provincia;
            document.getElementById('ciudad').value = cliente.ciudad;
            document.getElementById('domicilio').value = cliente.domicilio;
            document.getElementById('telefono').value = cliente.telefono;
            document.getElementById('transporte').value = cliente.transporte;
            document.getElementById('seguro').value = cliente.seguro;
            document.getElementById('condicionDeEntrega').value = cliente.condicionDeEntrega;
            
        }, 200); 
    }
});


/*  ******************************************
******* Listar los transportes****************
**********************************************/

document.addEventListener('DOMContentLoaded', () => {
    const transporteInput = document.getElementById('transporte');
    const suggestionsContainer = document.getElementById('suggestionsTransportes');
    let currentIndex = -1; // Índice de la sugerencia seleccionada

    transporteInput.addEventListener('input', async () => {
        const query = transporteInput.value.trim();

        if (query.length === 0) {
            suggestionsContainer.style.display = 'none';
            suggestionsContainer.innerHTML = '';
            currentIndex = -1;
            return;
        }

        try {
            const response = await fetch('/listarTransportes');
            const transportes = await response.json();

            // Filtra los transportes por el valor del input
            const filtered = transportes.filter(transporte =>
                transporte.nombre.toLowerCase().includes(query.toLowerCase())
            );

            // Renderiza las sugerencias
            suggestionsContainer.innerHTML = '';
            if (filtered.length > 1) {
                suggestionsContainer.style.display = 'grid';
                filtered.forEach((transporte, index) => {
                    const div = document.createElement('div');
                    div.classList.add('suggestion-item');
                    div.textContent = transporte.nombre;
                    div.dataset.index = index; // Asigna un índice a cada sugerencia
                    div.addEventListener('click', () => {
                        transporteInput.value = transporte.nombre;
                        suggestionsContainer.style.display = 'none';
                        currentIndex = -1;
                    });
                    suggestionsContainer.appendChild(div);
                });
                suggestionsContainer.style.display = 'block';
            } else {
                suggestionsContainer.style.display = 'none';
            }
            currentIndex = -1; // Reinicia el índice al actualizar las sugerencias
        } catch (error) {
            console.error('Error fetching transportes:', error);
        }
    });

    transporteInput.addEventListener('keydown', (event) => {
        const suggestions = Array.from(suggestionsContainer.querySelectorAll('.suggestion-item'));
        if (suggestions.length === 0) return;

        if (event.key === 'ArrowDown') {
            // Mueve hacia abajo
            currentIndex = (currentIndex + 1) % suggestions.length;
            updateActiveSuggestion(suggestions, currentIndex);
            event.preventDefault();
        } else if (event.key === 'ArrowUp') {
            // Mueve hacia arriba
            currentIndex = (currentIndex - 1 + suggestions.length) % suggestions.length;
            updateActiveSuggestion(suggestions, currentIndex);
            event.preventDefault();
        } else if (event.key === 'Enter') {
            // Selecciona la sugerencia activa
            if (currentIndex >= 0 && currentIndex < suggestions.length) {
                transporteInput.value = suggestions[currentIndex].textContent;
                suggestionsContainer.style.display = 'none';
                currentIndex = -1;
            }
            event.preventDefault();
        }
    });

    // Oculta las sugerencias al hacer clic fuera del campo
    document.addEventListener('click', (event) => {
        if (!suggestionsContainer.contains(event.target) && event.target !== transporteInput) {
            suggestionsContainer.style.display = 'none';
            currentIndex = -1;
        }
    });

    // Actualiza la clase de la sugerencia activa
    function updateActiveSuggestion(suggestions, index) {
        suggestions.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('active');
            }
        });
    }
});
