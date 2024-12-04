document.addEventListener('DOMContentLoaded', async () => {
    const productoInput = document.getElementById('producto'); // Cambiar el ID aquí
    const suggestionsContainer = document.querySelector('#suggestionsContainerProducto'); 
    let productos = [];
    let activeSuggestionIndex = -1;

    // Obtén la lista de productos una vez
    async function fetchProductos() {
        try {
            const response = await fetch('/buscarProductos');
            productos = await response.json();
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    }

    // Muestra las sugerencias
    function displaySuggestions(matches) {
        suggestionsContainer.innerHTML = ''; // Limpia el contenedor de sugerencias
        if (matches.length > 0) {
            suggestionsContainer.style.display = 'block';
            const inputRect = productoInput.getBoundingClientRect();
            suggestionsContainer.style.top = `${inputRect.bottom + window.scrollY}px`;
            suggestionsContainer.style.left = `${inputRect.left + window.scrollX}px`;
            suggestionsContainer.style.width = `${inputRect.width}px`;

            // Crear cada sugerencia como un elemento div
            matches.forEach((producto, index) => {
                const suggestion = document.createElement('div');
                suggestion.textContent = producto.sku; // Mostrar la descripción del producto
                suggestion.classList.add('suggestion-item');
                suggestion.addEventListener('click', () => selectProducto(producto.descripcion));
                suggestion.addEventListener('mouseenter', () => setActiveSuggestion(index)); // Resalta la sugerencia al pasar el ratón
                suggestionsContainer.appendChild(suggestion);
            });
        } else {
            suggestionsContainer.style.display = 'none';
        }
        activeSuggestionIndex = -1; // Reinicia el índice de la sugerencia activa
    }

    // Selecciona el producto
    function selectProducto(value) {
        productoInput.value = value;
        suggestionsContainer.style.display = 'none';
        activeSuggestionIndex = -1; // Reinicia el índice activo
    }

    // Establece el índice activo
    function setActiveSuggestion(index) {
        const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
        suggestions.forEach((suggestion, i) => {
            suggestion.classList.toggle('active', i === index);
        });
        activeSuggestionIndex = index;
        scrollToActiveSuggestion(); // Asegura que la sugerencia activa esté visible
    }

    // Desplaza el contenedor para que la sugerencia activa esté siempre visible
    function scrollToActiveSuggestion() {
        const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
        const activeSuggestion = suggestions[activeSuggestionIndex];
        if (activeSuggestion) {
            const containerRect = suggestionsContainer.getBoundingClientRect();
            const suggestionRect = activeSuggestion.getBoundingClientRect();

            // Verifica si la sugerencia está fuera del rango visible
            if (suggestionRect.top < containerRect.top) {
                suggestionsContainer.scrollTop -= (containerRect.top - suggestionRect.top);
            } else if (suggestionRect.bottom > containerRect.bottom) {
                suggestionsContainer.scrollTop += (suggestionRect.bottom - containerRect.bottom);
            }
        }
    } 

    // Controla las teclas de flecha para navegar en las sugerencias
    function handleArrowKeys(event) {
        const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
        if (suggestions.length === 0) return; // Si no hay sugerencias, salir

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            activeSuggestionIndex = (activeSuggestionIndex + 1) % suggestions.length;
            setActiveSuggestion(activeSuggestionIndex);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            activeSuggestionIndex = (activeSuggestionIndex - 1 + suggestions.length) % suggestions.length;
            setActiveSuggestion(activeSuggestionIndex);
        } else if (event.key === 'Enter' && activeSuggestionIndex >= 0) {
            event.preventDefault();
            selectProducto(suggestions[activeSuggestionIndex].textContent);
        }
    }

    // Escucha el input para SKU y muestra sugerencias
    productoInput.addEventListener('input', () => {
        const searchTerm = productoInput.value.toLowerCase();
        const matches = productos.filter(producto => producto.descripcion.toLowerCase().includes(searchTerm));
        displaySuggestions(matches);
    });

    // Carga los productos al cargar la página
    await fetchProductos();

    // Escuchar teclas de navegación solo si el contenedor de sugerencias está activo
    document.addEventListener('keydown', (event) => {
        if (suggestionsContainer.style.display === 'block') {
            handleArrowKeys(event);
        }
    });
});
