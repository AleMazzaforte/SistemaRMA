

document.addEventListener('DOMContentLoaded', () => {
    const inputMarcas = document.querySelectorAll('input[name="marca"]'); // Selecciona todos los inputs de marcas
    const suggestionsContainers = {};

    inputMarcas.forEach(input => {
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.classList.add('suggestions-container');
        suggestionsContainer.style.display = 'none';
        input.parentNode.insertBefore(suggestionsContainer, input.nextSibling);
        suggestionsContainers[input] = suggestionsContainer;

        input.addEventListener('input', () => fetchMarcas(input, suggestionsContainer));
        input.addEventListener('keydown', (e) => navigateSuggestions(e, suggestionsContainer));
        suggestionsContainer.addEventListener('click', (e) => selectSuggestion(e, input, suggestionsContainer));
    });

    const fetchMarcas = async (input, container) => {
        const query = input.value.trim().toLowerCase();
        if (query.length < 1) {
            container.style.display = 'none';
            return;
        }

        try {
            const response = await fetch('/listarMarcas');
            const data = await response.json();
            const marcas = data.marcas.filter(marca => marca.toLowerCase().includes(query));

            container.innerHTML = '';
            marcas.forEach(marca => {
                const suggestionItem = document.createElement('div');
                suggestionItem.classList.add('suggestion-item');
                suggestionItem.textContent = marca;
                container.appendChild(suggestionItem);
            });

            container.style.display = 'block';
        } catch (error) {
            console.error('Error fetching marcas:', error);
        }
    };

    const navigateSuggestions = (e, container) => {
        const items = container.querySelectorAll('.suggestion-item');
        let selectedIndex = -1;

        if (e.key === 'ArrowDown') {
            selectedIndex = (selectedIndex + 1) % items.length;
            highlightSuggestion(items, selectedIndex);
        } else if (e.key === 'ArrowUp') {
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            highlightSuggestion(items, selectedIndex);
        } else if (e.key === 'Enter') {
            if (selectedIndex >= 0 && items[selectedIndex]) {
                items[selectedIndex].click();
            }
        }
    };

    const highlightSuggestion = (items, index) => {
        items.forEach((item, i) => {
            item.classList.toggle('highlighted', i === index);
        });
    };

    const selectSuggestion = (e, input, container) => {
        if (e.target.classList.contains('suggestion-item')) {
            input.value = e.target.textContent;
            container.style.display = 'none';
        }
    };
});
