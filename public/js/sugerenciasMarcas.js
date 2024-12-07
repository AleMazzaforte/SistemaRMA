document.addEventListener('DOMContentLoaded', () => {
    const marcaInput = document.getElementById('marca');
    

    marcaInput.addEventListener('input', sugerirMarcas);

    async function sugerirMarcas() {
        let suggestionsContainer = document.getElementById('suggestionsMarca');
        let divRelleno = document.querySelector('.divrellenoMarca');
        
        // Si no existe, crearlo dinámicamente
        if (!divRelleno) {
            divRelleno = document.createElement('div');
            divRelleno.className = 'divrellenoMarca divrelleno';
            marcaInput.parentNode.insertBefore(divRelleno, marcaInput.nextSibling);
        }

        if (!suggestionsContainer) {
            suggestionsContainer = document.createElement('div');
            suggestionsContainer.id = 'suggestionsMarca';
            suggestionsContainer.className = 'suggestions-container';
            marcaInput.parentNode.insertBefore(suggestionsContainer, divRelleno.nextSibling);
        }

        const query = marcaInput.value.trim().toLowerCase();
        if (query.length > 0) {
            try {
                const response = await fetch('/listarMarcas');
                const marcas = await response.json();
                const matches = marcas.filter(marca => marca.nombre.toLowerCase().includes(query));

                suggestionsContainer.innerHTML = '';
                if (matches.length > 0) {
                    suggestionsContainer.style.display = 'block';
                    suggestionsContainer.style.backgroundColor = 'white';
                    const inputRect = marcaInput.getBoundingClientRect();
                    suggestionsContainer.style.top = `${inputRect.bottom + window.scrollY}px`;
                    suggestionsContainer.style.transform = 'translateY(-9px)'; // Ajustar el valor negativo para moverlo hacia arriba
                    suggestionsContainer.style.left = `${inputRect.left + window.scrollX}px`;
                    suggestionsContainer.style.width = `${inputRect.width}px`;

                    matches.forEach((marca, index) => {
                        const suggestion = document.createElement('div');
                        suggestion.textContent = marca.nombre;
                        suggestion.classList.add('suggestion-item');
                        suggestion.addEventListener('click', () => selectMarca(marca.nombre));
                        suggestion.addEventListener('mouseenter', () => setActiveSuggestion(index));
                        suggestionsContainer.appendChild(suggestion);
                    });
                } else {
                    suggestionsContainer.style.display = 'none';
                }
                highlightedIndex = -1; // Reiniciar el índice resaltado
            } catch (error) {
                console.error('Error fetching marcas:', error);
            }
        } else {
            suggestionsContainer.style.display = 'none';
        }
    }

    // Seleccionar Marca
    function selectMarca(nombre) {
        marcaInput.value = nombre;
        document.getElementById('suggestionsMarca').style.display = 'none';
        highlightedIndex = -1; // Reiniciar el índice resaltado
    }

    // Establecer índice activo
    function setActiveSuggestion(index) {
        const suggestions = document.querySelectorAll('#suggestionsMarca .suggestion-item');
        suggestions.forEach((suggestion, i) => {
            suggestion.classList.toggle('active', i === index);
        });
    }

    // Desplazar contenedor para ver sugerencia activa
    function scrollToActiveSuggestion() {
        const suggestions = document.querySelectorAll('#suggestionsMarca .suggestion-item');
        const activeSuggestion = suggestions[highlightedIndex];
        if (activeSuggestion) {
            const containerRect = document.getElementById('suggestionsMarca').getBoundingClientRect();
            const suggestionRect = activeSuggestion.getBoundingClientRect();

            if (suggestionRect.top < containerRect.top) {
                suggestionsMarca.scrollTop -= (containerRect.top - suggestionRect.top);
            } else if (suggestionRect.bottom > containerRect.bottom) {
                suggestionsMarca.scrollTop += (suggestionRect.bottom - containerRect.bottom);
            }
        }
    }

    // Manejar la navegación con flechas y selección con Enter
    marcaInput.addEventListener('keydown', (e) => {
        const suggestionItems = document.querySelectorAll('#suggestionsMarca .suggestion-item');
        if (e.key === 'ArrowDown') {
            highlightedIndex = (highlightedIndex + 1) % suggestionItems.length;
            setActiveSuggestion(highlightedIndex);
            scrollToActiveSuggestion();
            e.preventDefault(); // Evitar el desplazamiento de la página
        } else if (e.key === 'ArrowUp') {
            highlightedIndex = (highlightedIndex - 1 + suggestionItems.length) % suggestionItems.length;
            setActiveSuggestion(highlightedIndex);
            scrollToActiveSuggestion();
            e.preventDefault(); // Evitar el desplazamiento de la página
        } else if (e.key === 'Enter') {
            if (highlightedIndex >= 0 && suggestionItems[highlightedIndex]) {
                selectMarca(suggestionItems[highlightedIndex].textContent);
                e.preventDefault(); // Evitar el envío del formulario
            }
        }
    });

    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener('click', (event) => {
        const suggestionsMarca = document.getElementById('suggestionsMarca');
        if (suggestionsMarca && !suggestionsMarca.contains(event.target) && event.target !== marcaInput) {
            suggestionsMarca.style.display = 'none';
        }
    });
});

