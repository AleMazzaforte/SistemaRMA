console.log('archivo enlazado')


document.addEventListener('DOMContentLoaded', () => {
    const skuInput = document.getElementById('sku');
    const marcaInput = document.getElementById('marca');
    const rubroInput = document.getElementById('rubro');
    const descripcionInput = document.getElementById('descripcion');
    const suggestionsContainer = document.querySelector('#suggestionsContainer1');
    const botonActualizar = document.getElementById('botonActualizarProducto');
    const botonEliminar = document.getElementById('botonEliminarProducto');
    const botonGuardar = document.getElementById('botonGuardarProducto');
    
    let productos = [];
    let activeSuggestionIndex = -1;

    async function fetchProductos() {
        try {
            const response = await fetch('/buscarProductos');
            productos = await response.json();
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    } 

    function displaySuggestions(matches, inputElement, key) { 
        suggestionsContainer.innerHTML = '';
        if (matches.length) {
            suggestionsContainer.style.display = 'block';
            const inputRect = inputElement.getBoundingClientRect();
            suggestionsContainer.style.top = `${inputRect.bottom + window.scrollY}px`;
            suggestionsContainer.style.left = `${inputRect.left + window.scrollX}px`;
            suggestionsContainer.style.width = `${inputRect.width}px`;
        } else {
            suggestionsContainer.style.display = 'none';
        }
    
        const uniqueMatches = [...new Set(matches.map(producto => producto[key]))];
        uniqueMatches.forEach((value, index) => {
            const suggestion = document.createElement('div');
            suggestion.textContent = value;
            suggestion.classList.add('suggestion-item');
            suggestion.addEventListener('click', () => selectProducto(value, key, inputElement));
            suggestionsContainer.appendChild(suggestion);
        });
        activeSuggestionIndex = -1; // Reset index when new suggestions are displayed
    }

    function selectProducto(value, key, inputElement) {
        suggestionsContainer.style.display = 'none';
        inputElement.value = value;
    }

    function handleArrowKeys(event, inputElement) {
        const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            activeSuggestionIndex = (activeSuggestionIndex + 1) % suggestions.length;
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            activeSuggestionIndex = (activeSuggestionIndex - 1 + suggestions.length) % suggestions.length;
        } else if (event.key === 'Enter' && activeSuggestionIndex >= 0) {
            event.preventDefault();
            selectProducto(suggestions[activeSuggestionIndex].textContent, inputElement.getAttribute('name'), inputElement);
            return;
        }
        suggestions.forEach((suggestion, index) => {
            suggestion.classList.toggle('active', index === activeSuggestionIndex);
        });
    }

    skuInput.addEventListener('input', () => {
        const searchTerm = skuInput.value.toLowerCase();
        const matches = productos.filter(producto =>
            producto.sku.toLowerCase().includes(searchTerm)
        );
        displaySuggestions(matches, skuInput, 'sku');
    });

    skuInput.addEventListener('keydown', (event) => {
        handleArrowKeys(event, skuInput);
    });

    marcaInput.addEventListener('input', () => {
        const searchTerm = marcaInput.value.toLowerCase();
        const matches = productos.filter(producto =>
            producto.marca.toLowerCase().includes(searchTerm)
        );
        displaySuggestions(matches, marcaInput, 'marca');
    });

    marcaInput.addEventListener('keydown', (event) => {
        handleArrowKeys(event, marcaInput);
    });

    rubroInput.addEventListener('input', () => {
        const searchTerm = rubroInput.value.toLowerCase();
        const matches = productos.filter(producto =>
            producto.rubro.toLowerCase().includes(searchTerm)
        );
        displaySuggestions(matches, rubroInput, 'rubro');
    });

    rubroInput.addEventListener('keydown', (event) => {
        handleArrowKeys(event, rubroInput);
    });

    async function fetchProductos() {
        try {
            const response = await fetch('/buscarProductos');
            productos = await response.json();
           
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    }
    
    botonActualizar.addEventListener('click', () => {
        const searchTerm = skuInput.value.toLowerCase();
        const matches = productos.filter(producto => producto.sku.toLowerCase() === searchTerm);
        if (matches.length > 0) {
            const producto = matches[0];
            // Verifica si producto.id está disponible
            if (producto.id) {
                skuInput.dataset.productId = producto.id;  // Guardar id en dataset
                marcaInput.value = producto.marca;
                rubroInput.value = producto.rubro;
                descripcionInput.value = producto.descripcion;
                botonActualizar.style.display = 'none';
                botonGuardar.style.display = 'inline-block';
                console.log('producto dentro de matches.length', producto);
            } else {
                console.error('El producto seleccionado no tiene un ID.');
            }
        }
    });
    
    
    botonGuardar.addEventListener('click', async () => {
        const productoId = skuInput.dataset.productId; 
        const sku =  skuInput.value;

        try {
            await fetch(`/actualizarProducto/${productoId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sku:  sku,
                    marca: marcaInput.value,
                    descripcion: descripcionInput.value,
                    rubro: rubroInput.value,
                }),
            });
            alert('Producto actualizado correctamente');
            location.reload();
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            alert('Error al actualizar el producto');
        }
    });
    
    

    botonEliminar.addEventListener('click', async () => {
        const sku = skuInput.value; // Obtener el SKU del input
        try {
            const response = await fetch('/eliminarProducto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sku }), // Enviar el SKU en el cuerpo de la solicitud
            });
    
            if (response.ok) {
                alert('Producto eliminado correctamente');
                location.reload();
            } else {
                alert('Error al eliminar el producto');
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            alert('Error al eliminar el producto');
        }
    });
    

    fetchProductos(); 
    
});
