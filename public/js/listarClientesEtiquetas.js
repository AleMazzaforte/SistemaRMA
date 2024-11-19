document.addEventListener('DOMContentLoaded', () => {
    const nombreInput = document.getElementById('nombre');
    const suggestionsContainer = document.getElementById('suggestions-container');
    let clientes = [];
    let filteredClientes = [];
    let activeIndex = -1; // Índice de la sugerencia activa

    // Función para obtener clientes desde el servidor
    async function getClientes() {
        try {
            const response = await fetch('/buscarCliente');
            const data = await response.json();
            clientes = data;  // Guardamos los resultados
           
        } catch (error) {
            console.error('Error al obtener clientes:', error);
        }
    }

    // Filtra clientes según el texto ingresado
    function filterClientes(query) {
        return clientes.filter(cliente =>
            cliente.nombre.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Muestra las sugerencias
    function showSuggestions(clientesFiltrados) {
        suggestionsContainer.innerHTML = ''; // Limpiar sugerencias anteriores
        activeIndex = -1; // Reiniciar índice activo
        if (clientesFiltrados.length > 0) {
            clientesFiltrados.forEach((cliente, index) => {
                const div = document.createElement('div');
                div.classList.add('suggestion-item');
                div.textContent = cliente.nombre;
                div.dataset.index = index;
                div.addEventListener('click', () => selectCliente(cliente));
                suggestionsContainer.appendChild(div);
            });
            suggestionsContainer.style.display = 'block'; // Mostrar contenedor de sugerencias
        } else {
            suggestionsContainer.style.display = 'none';
        }
    }

    // Selecciona un cliente
    function selectCliente(cliente) {
        nombreInput.value = cliente.nombre; // Mostramos el nombre en el input
        suggestionsContainer.style.display = 'none'; // Ocultar sugerencias
        const idSeleccionado= cliente.id;
    }

    // Maneja las teclas (flechita arriba, flechita abajo, Enter)
    nombreInput.addEventListener('keydown', (event) => {
        const suggestionItems = suggestionsContainer.querySelectorAll('.suggestion-item');
        if (event.key === 'ArrowDown' && suggestionItems.length > 0) {
            activeIndex = (activeIndex + 1) % suggestionItems.length;
            updateActiveItem(suggestionItems);
        } else if (event.key === 'ArrowUp' && suggestionItems.length > 0) {
            activeIndex = (activeIndex - 1 + suggestionItems.length) % suggestionItems.length;
            updateActiveItem(suggestionItems);
        } else if (event.key === 'Enter' && activeIndex > -1) {
            event.preventDefault(); 
            const selectedCliente = filteredClientes[activeIndex]; // Usar lista filtrada
            selectCliente(selectedCliente);
        }
    });

    // Resalta el item activo
    function updateActiveItem(suggestionItems) {
        suggestionItems.forEach((item, index) => {
            item.classList.remove('active');
            if (index === activeIndex) {
                item.classList.add('active');
            }
        });
    }

    // Filtra clientes y muestra sugerencias en base al valor ingresado
    nombreInput.addEventListener('input', (event) => {
        const query = event.target.value.trim();
        if (query.length > 0) {
            filteredClientes = filterClientes(query); // Actualiza la lista filtrada
            showSuggestions(filteredClientes);
        } else {
            suggestionsContainer.style.display = 'none'; // Ocultar si no hay texto
        }
    });

    // Cierra las sugerencias al hacer clic fuera del campo de texto
    document.addEventListener('click', (event) => {
        if (!suggestionsContainer.contains(event.target) && event.target !== nombreInput) {
            suggestionsContainer.style.display = 'none'; // Ocultar si hace clic fuera
        }
    });

    // Obtener clientes al cargar la página
    getClientes();
});

