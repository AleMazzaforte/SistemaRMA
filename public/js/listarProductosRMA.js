

document.addEventListener('DOMContentLoaded', async () => {
    const modelo = document.getElementById('modelo'); // Asegúrate de que el ID es correcto
    const suggestionsContainer2 = document.querySelector('#suggestionsContainer2'); 
    let productos = [];
    let activeSuggestionIndex1 = -1;

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
        suggestionsContainer2.innerHTML = ''; // Limpia el contenedor de sugerencias
        if (matches.length > 0) {
            suggestionsContainer2.style.display = 'block';
            const inputRect = modelo.getBoundingClientRect();
            suggestionsContainer2.style.top = `${inputRect.bottom + window.scrollY}px`;
            suggestionsContainer2.style.left = `${inputRect.left + window.scrollX}px`;
            suggestionsContainer2.style.width = `${inputRect.width}px`;

            // Crear cada sugerencia como un elemento div
            matches.forEach((producto, index) => {
                const suggestion = document.createElement('div');
                suggestion.textContent = producto.sku;
                suggestion.classList.add('suggestion-item');
                suggestion.addEventListener('click', () => selectProducto(producto.sku));
                suggestion.addEventListener('mouseenter', () => setActiveSuggestion(index)); // Resalta la sugerencia al pasar el ratón
                suggestionsContainer2.appendChild(suggestion);
            });
        } else {
            suggestionsContainer2.style.display = 'none';
        }
        activeSuggestionIndex1 = -1; // Reinicia el índice de la sugerencia activa
    }

    // Selecciona el producto
    function selectProducto(value) {
        modelo.value = value;
        suggestionsContainer2.style.display = 'none';
        activeSuggestionIndex1 = -1; // Reinicia el índice activo
        setTimeout(() => {
            document.getElementById('botonCargar').disabled = false;
        }, 100);
    }

    // Establece el índice activo
    function setActiveSuggestion(index) {
        const suggestions1 = suggestionsContainer2.querySelectorAll('.suggestion-item');
        suggestions1.forEach((suggestion, i) => {
            suggestion.classList.toggle('active', i === index);
        });
        activeSuggestionIndex1 = index;
        scrollToActiveSuggestion(); // Asegura que la sugerencia activa esté visible
    }

    // Desplaza el contenedor para que la sugerencia activa esté siempre visible
    function scrollToActiveSuggestion() {
        const suggestions1 = suggestionsContainer2.querySelectorAll('.suggestion-item');
        const activeSuggestion = suggestions1[activeSuggestionIndex1];
        if (activeSuggestion) {
            const containerRect = suggestionsContainer2.getBoundingClientRect();
            const suggestionRect = activeSuggestion.getBoundingClientRect();

            // Verifica si la sugerencia está fuera del rango visible
            if (suggestionRect.top < containerRect.top) {
                suggestionsContainer2.scrollTop -= (containerRect.top - suggestionRect.top);
            } else if (suggestionRect.bottom > containerRect.bottom) {
                suggestionsContainer2.scrollTop += (suggestionRect.bottom - containerRect.bottom);
            }
        }
    } 

    // Controla las teclas de flecha para navegar en las sugerencias
    function handleArrowKeys1(event) {
        const suggestions1 = suggestionsContainer2.querySelectorAll('.suggestion-item');
        if (suggestions1.length === 0) return; // Si no hay sugerencias, salir

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            activeSuggestionIndex1 = (activeSuggestionIndex1 + 1) % suggestions1.length;
            setActiveSuggestion(activeSuggestionIndex1);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            activeSuggestionIndex1 = (activeSuggestionIndex1 - 1 + suggestions1.length) % suggestions1.length;
            setActiveSuggestion(activeSuggestionIndex1);
        } else if (event.key === 'Enter' && activeSuggestionIndex1 >= 0) {
            event.preventDefault();
            selectProducto(suggestions1[activeSuggestionIndex1].textContent);
        }
    }

    // Escucha el input para SKU y muestra sugerencias
    modelo.addEventListener('input', () => {
        const searchTerm = modelo.value.toLowerCase();
        const matches = productos.filter(producto => producto.sku.toLowerCase().includes(searchTerm));
        displaySuggestions(matches);
    });

    // Carga los productos al cargar la página
    await fetchProductos();

    // Escuchar teclas de navegación solo si el contenedor de sugerencias está activo
    document.addEventListener('keydown', (event) => {
        if (suggestionsContainer2.style.display === 'block') {
            handleArrowKeys1(event);
        }
    });
});


