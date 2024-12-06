document.addEventListener('DOMContentLoaded', async () => {
    const buscarOpInput = document.getElementById('buscarOp');
    const suggestionsContainerOp = document.getElementById('suggestionsContainerOp');
    const opInput = document.getElementById('op');
    const tablaProductos = document.getElementById('tablaProductos');
    const botonActualizar = document.getElementById('botonActualizar');
    let ops = [];
    let activeSuggestionIndexOp = -1;

    // Deshabilitar el botón de actualizar al cargar la página
    botonActualizar.disabled = true;

    // Obtener la lista de OPs únicas
    async function fetchOps() {
        try {
            const response = await fetch('/buscarOps');
            ops = await response.json();
        } catch (error) {
            console.error('Error al obtener OPs:', error);
        }
    }

    // Mostrar las sugerencias de OPs
    function displayOpSuggestions(matches) {
        suggestionsContainerOp.innerHTML = ''; // Limpiar contenedor de sugerencias
        if (matches.length > 0) {
            suggestionsContainerOp.style.display = 'block';
            const inputRect = buscarOpInput.getBoundingClientRect();
            suggestionsContainerOp.style.top = `${inputRect.bottom + window.scrollY}px`;
            suggestionsContainerOp.style.left = `${inputRect.left + window.scrollX}px`;
            suggestionsContainerOp.style.width = `${inputRect.width}px`;

            matches.forEach((op, index) => {
                const suggestion = document.createElement('div');
                suggestion.textContent = op.op;
                suggestion.classList.add('suggestion-item');
                suggestion.addEventListener('click', () => selectOp(op.op));
                suggestion.addEventListener('mouseenter', () => setActiveSuggestionOp(index));
                suggestionsContainerOp.appendChild(suggestion);
            });
        } else {
            suggestionsContainerOp.style.display = 'none';
        }
        activeSuggestionIndexOp = -1;
    }

    // Seleccionar una OP
    async function selectOp(op) {
        opInput.value = op;
        suggestionsContainerOp.style.display = 'none';
        await fetchDetalleOp(op);
    }

    // Obtener detalles de la OP seleccionada
    async function fetchDetalleOp(op) {
        try {
            const response = await fetch(`/detalleOp/${op}`);
            const productos = await response.json();
            displayProductos(productos);
        } catch (error) {
            console.error('Error al obtener detalles de la OP:', error);
        }
    }

    // Mostrar productos y cantidades en una tabla
    function displayProductos(productos) {
        let html = '<table>';
        html += '<tr><th>Producto</th><th>Cantidad</th><th>Acciones</th></tr>';
        productos.forEach((producto, index) => {
            html += `<tr>
                        <td>
                            <input type="text" name="producto${index}" class="producto" value="${producto.producto}">
                            <div class="suggestions-container" id="suggestionsContainerProducto${index}"></div>
                        </td>
                        <td><input type="number" name="cantidad${index}" class="cantidad" value="${producto.cantidad}"></td>
                        <td><button type="button" onclick="eliminarFila(${index}, '${producto.producto}')">Eliminar</button></td>
                     </tr>`;
        });
        html += '</table>';
        tablaProductos.innerHTML = html;

        // Añadir buscador de productos a los inputs recién creados
        const productoInputs = document.querySelectorAll('.producto');
        
        productoInputs.forEach((input, index) => {
            const suggestionsContainer = document.getElementById(`suggestionsContainerProducto${index}`);
            input.addEventListener('input', () => {
                fetchProductos(input, suggestionsContainer);
                botonActualizar.disabled = false; // Habilitar el botón de actualizar al modificar el input
            });
            input.addEventListener('keydown', (e) => navigateSuggestions(e, suggestionsContainer));
        });

        const cantidadInputs = document.querySelectorAll('.cantidad');
        cantidadInputs.forEach(input => {
            input.addEventListener('input', () => {
                botonActualizar.disabled = false; // Habilitar el botón de actualizar al modificar el input
            });
        });
    }

    // Definir la función eliminarFila
    window.eliminarFila = async (index, producto) => {
        const filas = tablaProductos.querySelectorAll('tr');

        if (index >= 0 && index < filas.length - 1) { // Evitar eliminar la cabecera
            // Eliminar de la base de datos
            try {
                const response = await fetch('/eliminarProducto', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ producto })
                });

                if (!response.ok) {
                    alert('Error al eliminar el producto de la base de datos');
                    return;
                }

                filas[index + 1].remove(); // +1 para evitar eliminar la cabecera
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
                alert('Error al eliminar el producto de la base de datos');
            }
        }

        botonActualizar.disabled = false; // Habilitar el botón de actualizar al eliminar un producto
    };

    // Definir la función navigateSuggestions
    function navigateSuggestions(e, container) {
        if (!container) return; // Verificar si el contenedor existe
        const items = container.querySelectorAll('.suggestion-item');
        if (items.length === 0) return; // Si no hay sugerencias, salir

        let selectedIndex = container.dataset.selectedIndex ? parseInt(container.dataset.selectedIndex) : -1;

        if (e.key === 'ArrowDown') {
            selectedIndex = (selectedIndex + 1) % items.length;
        } else if (e.key === 'ArrowUp') {
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        } else if (e.key === 'Enter') {
            if (selectedIndex >= 0 && items[selectedIndex]) {
                items[selectedIndex].click();
            }
        }

        container.dataset.selectedIndex = selectedIndex;
        highlightSuggestion(items, selectedIndex);
    }

    // Definir la función highlightSuggestion
    function highlightSuggestion(items, index) {
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }

    // Obtener productos para los inputs de producto
    async function fetchProductos(input, container) {
        if (!container) return; // Verificar si el contenedor existe
        const query = input.value.trim().toLowerCase();
        if (query.length < 1) {
            container.style.display = 'none';
            return;
        }

        try {
            const response = await fetch('/buscarProductos');
            const data = await response.json();
            const productos = data.filter(producto => producto.sku.toLowerCase().includes(query));

            container.innerHTML = '';
            productos.forEach((producto) => {
                const suggestion = document.createElement('div');
                suggestion.textContent = producto.sku;
                suggestion.classList.add('suggestion-item');
                suggestion.addEventListener('click', () => selectProducto(producto.sku, input, container));
                container.appendChild(suggestion);
            });

            container.style.display = 'block';
        } catch (error) {
            console.error('Error fetching productos:', error);
        }
    }

    // Seleccionar producto de las sugerencias
    function selectProducto(value, input, container) {
        input.value = value;
        container.style.display = 'none';
    }

    // Inicializar la lista de OPs al cargar la página
    await fetchOps();

    // Manejar la entrada en el buscador de OPs
    buscarOpInput.addEventListener('input', () => {
        const searchTerm = buscarOpInput.value.toLowerCase();
        const matches = ops.filter(op => op.op.toLowerCase().includes(searchTerm));
        displayOpSuggestions(matches);
    });

    // Definir la función handleArrowKeysOp
    function handleArrowKeysOp(event) {
        const suggestions = suggestionsContainerOp.querySelectorAll('.suggestion-item');
        if (suggestions.length === 0) return; // Si no hay sugerencias, salir

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            activeSuggestionIndexOp = (activeSuggestionIndexOp + 1) % suggestions.length;
            setActiveSuggestionOp(activeSuggestionIndexOp);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            activeSuggestionIndexOp = (activeSuggestionIndexOp - 1 + suggestions.length) % suggestions.length;
            setActiveSuggestionOp(activeSuggestionIndexOp);
        } else if (event.key === 'Enter' && activeSuggestionIndexOp >= 0) {
            event.preventDefault();
            selectOp(suggestions[activeSuggestionIndexOp].textContent);
        }
    }

    // Establecer la sugerencia activa
    function setActiveSuggestionOp(index) {
        const suggestions = suggestionsContainerOp.querySelectorAll('.suggestion-item');
        suggestions.forEach((suggestion, i) => {
            suggestion.classList.toggle('active', i === index);
        });
        activeSuggestionIndexOp = index;
        scrollToActiveSuggestionOp(); // Asegura que la sugerencia activa esté visible
    }

    // Desplazar el contenedor para que la sugerencia activa esté siempre visible
    function scrollToActiveSuggestionOp() {
        const suggestions = suggestionsContainerOp.querySelectorAll('.suggestion-item');
        const activeSuggestion = suggestions[activeSuggestionIndexOp];
        if (activeSuggestion) {
            const containerRect = suggestionsContainerOp.getBoundingClientRect();
            const suggestionRect = activeSuggestion.getBoundingClientRect();

            // Verifica si la sugerencia está fuera del rango visible
            if (suggestionRect.top < containerRect.top) {
                suggestionsContainerOp.scrollTop -= (containerRect.top - suggestionRect.top);
            } else if (suggestionRect.bottom > containerRect.bottom) {
                suggestionsContainerOp.scrollTop += (suggestionRect.bottom - containerRect.bottom);
            }
        }
    }

    // Escuchar teclas de navegación solo si el contenedor de sugerencias está activo
    document.addEventListener('keydown', (event) => {
        if (suggestionsContainerOp.style.display === 'block') {
            handleArrowKeysOp(event);
        }
    });

    // Manejar la actualización de OPs
    botonActualizar.addEventListener('click', async () => {
        const op = opInput.value.trim();
        const productos = [];
        const productoInputs = document.querySelectorAll('.producto');
        const cantidadInputs = document.querySelectorAll('.cantidad');

        productoInputs.forEach((input, index) => {
            const producto = input.value.trim();
            const cantidad = cantidadInputs[index].value.trim();
            if (producto && cantidad) {
                productos.push({ producto, cantidad });
            }
        });

        try {
            const response = await fetch('/actualizarOp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ op, productos })
            });

            if (response.ok) {
                alert('OP actualizada exitosamente');
                botonActualizar.disabled = true; // Deshabilitar el botón después de la actualización
            } else {
                alert('Error al actualizar la OP');
            }
        } catch (error) {
            console.error('Error al actualizar la OP:', error);
            alert('Error al actualizar la OP');
        }
    });

});

        
