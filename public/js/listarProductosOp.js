document.addEventListener('DOMContentLoaded', async () => {
    const formOp = document.getElementById('formOp');
    const opInput = document.getElementById('op');
    const fechaIngresoInput = document.getElementById('fechaIngreso');
    const productoInput = document.getElementById('producto');
    const cantidadInput = document.getElementById('cantidad');
    const añadirProductoBtn = document.getElementById('añadirProducto');
    const sugerenciasProductosDiv = document.getElementById('sugerenciasProductos');
    const suggestionsContainer = document.querySelector('#suggestionsContainerProducto'); 
    let productos = [];
    let productosList = [];
    let activeSuggestionIndex = -1;

    // Obtén la lista de productos una vez
    async function fetchProductos() {
        try {
            const response = await fetch('/buscarProductos');
            productosList = await response.json();
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

            matches.forEach((producto, index) => {
                const suggestion = document.createElement('div');
                suggestion.textContent = producto.sku; // Mostrar el SKU del producto
                suggestion.classList.add('suggestion-item');
                suggestion.addEventListener('click', () => selectProducto(producto.sku));
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
        const matches = productosList.filter(producto => producto.sku.toLowerCase().includes(searchTerm));
        displaySuggestions(matches);
    });

    // Añadir producto a la lista
    añadirProductoBtn.addEventListener('click', () => {
        const producto = productoInput.value.trim();
        const cantidad = cantidadInput.value.trim();

        if (producto && cantidad) {
            const productoObj = { producto, cantidad };
            productos.push(productoObj);
            actualizarListaProductos();
            productoInput.value = '';
            cantidadInput.value = '';
            productoInput.focus(); // Mover el foco al input de producto
        } else {
            alert('Por favor, completa ambos campos antes de añadir.');
        }
    });

    // Actualizar la visualización de la lista de productos
    function actualizarListaProductos() {
        sugerenciasProductosDiv.innerHTML = '';
        productos.forEach((producto, index) => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto-item');
            productoDiv.innerHTML = `
                <span>Producto: ${producto.producto} - Cantidad: ${producto.cantidad}</span>
                <button type="button" class = "botonEliminarItem" onclick="eliminarProducto(${index})">Eliminar</button>
            `;
            sugerenciasProductosDiv.appendChild(productoDiv);
        });
    }

    // Eliminar producto de la lista
    window.eliminarProducto = (index) => {
        productos.splice(index, 1);
        actualizarListaProductos();
    };

    // Enviar formulario con los productos añadidos
    formOp.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (productos.length === 0) {
            alert('Por favor, añade al menos un producto antes de enviar.');
            return;
        }

        const op = opInput.value;
        const fechaIngreso = fechaIngresoInput.value;
        
        try {
            const response = await fetch('/cargarOp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ op, fechaIngreso, productos })
            });

            if (response.ok) {
                alert('OP cargada exitosamente');
                formOp.reset();
                productos = [];
                actualizarListaProductos();
            } else {
                alert('Error al cargar la OP');
            }
        } catch (error) {
            console.error('Error al cargar la OP:', error);
            alert('Error al cargar la OP');
        }
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
