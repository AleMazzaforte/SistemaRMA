document.addEventListener('DOMContentLoaded', () => {
    const opInput = document.getElementById('op');
    const suggestionsOpContainer = document.getElementById('suggestionsOp');
    let ops = [];
    let highlightedIndex = -1; // Índice del elemento resaltado

    // Obtener OP para sugerencias
    async function fetchOps() {
        try {
            const response = await fetch('/buscarOps');
            ops = await response.json();
        } catch (error) {
            console.error('Error al obtener OP:', error);
        }
    }

    // Mostrar sugerencias
    function displaySuggestions(matches) {
        suggestionsOpContainer.innerHTML = '';
        if (matches.length > 0) {
            suggestionsOpContainer.style.display = 'block';
            suggestionsOpContainer.style.backgroundColor = 'white'
            const inputRect = opInput.getBoundingClientRect();
            suggestionsOpContainer.style.top = `${inputRect.bottom + window.scrollY}px`;
            suggestionsOpContainer.style.left = `${inputRect.left + window.scrollX}px`;
            suggestionsOpContainer.style.width = `${inputRect.width}px`;

            matches.forEach((op, index) => {
                const suggestion = document.createElement('div');
                suggestion.textContent = op.op; // Asegúrate de que este campo es correcto
                suggestion.classList.add('suggestion-item');
                suggestion.addEventListener('click', () => selectOp(op.op)); // Asegúrate de que este campo es correcto
                suggestion.addEventListener('mouseenter', () => setActiveSuggestion(index));
                suggestionsOpContainer.appendChild(suggestion);
            });
        } else {
            suggestionsOpContainer.style.display = 'none';
        }
        highlightedIndex = -1; // Reiniciar el índice resaltado
    }

    // Seleccionar OP
    function selectOp(nombre) {
        opInput.value = nombre;
        suggestionsOpContainer.style.display = 'none';
        highlightedIndex = -1; // Reiniciar el índice resaltado
    }

    // Establecer índice activo
    function setActiveSuggestion(index) {
        const suggestions = suggestionsOpContainer.querySelectorAll('.suggestion-item');
        suggestions.forEach((suggestion, i) => {
            suggestion.classList.toggle('active', i === index);
        });
    }

    // Desplazar contenedor para ver sugerencia activa
    function scrollToActiveSuggestion() {
        const suggestions = suggestionsOpContainer.querySelectorAll('.suggestion-item');
        const activeSuggestion = suggestions[highlightedIndex];
        if (activeSuggestion) {
            const containerRect = suggestionsOpContainer.getBoundingClientRect();
            const suggestionRect = activeSuggestion.getBoundingClientRect();
            if (suggestionRect.top < containerRect.top) {
                suggestionsOpContainer.scrollTop -= (containerRect.top - suggestionRect.top);
            } else if (suggestionRect.bottom > containerRect.bottom) {
                suggestionsOpContainer.scrollTop += (suggestionRect.bottom - containerRect.bottom);
            }
        }
    }

    // Manejar la navegación con flechas y selección con Enter
    opInput.addEventListener('keydown', (e) => {
        const suggestionItems = suggestionsOpContainer.querySelectorAll('.suggestion-item');
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
                selectOp(suggestionItems[highlightedIndex].textContent); // Seleccionar la OP resaltada
                e.preventDefault(); // Evitar el envío del formulario
            }
        }
    });

    // Mostrar sugerencias al ingresar texto
    opInput.addEventListener('input', (event) => {
        const query = event.target.value.trim();
        if (query.length > 0) {
            const matches = ops.filter(op => op.op.toLowerCase().includes(query.toLowerCase())); // Asegúrate de que este campo es correcto
            displaySuggestions(matches);
        } else {
            suggestionsOpContainer.style.display = 'none';
        }
    });

    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener('click', (event) => {
        if (!suggestionsOpContainer.contains(event.target) && event.target !== opInput) {
            suggestionsOpContainer.style.display = 'none';
        }
    });

    // Cargar OP al cargar la página
    fetchOps();
});

