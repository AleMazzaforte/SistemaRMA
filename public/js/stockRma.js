document.addEventListener('DOMContentLoaded', () => {
    fetch('/stock')
        .then(response => response.json())
        .then(stockData => {
            const acumulado = {};

            // Procesar los datos y acumular las cantidades por SKU y Marca
            stockData.forEach(item => {
                const key = `${item.modelo}-${item.marca}`;
                if (!acumulado[key]) {
                    acumulado[key] = { modelo: item.modelo, cantidad: 0, marca: item.marca };
                }
                acumulado[key].cantidad += item.cantidad;
            });

            // Guardar los datos acumulados para filtrado
            window.acumulado = acumulado;
            renderTable(acumulado);
            setupFilter(); // Configurar el filtro después de cargar los datos
        })
        .catch(error => {
            console.error('Error fetching stock data:', error);
        });
});

// Función para renderizar la tabla
function renderTable(data) {
    const stockDiv = document.getElementById('stockTable');
    stockDiv.innerHTML = ''; // Limpiar contenido previo
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>SKU</th>
                <th>Cantidad</th>
                <th>Marca</th>
            </tr>
        </thead>
        <tbody>
            ${Object.values(data).map(item => `
                <tr>
                    <td>${item.modelo}</td>
                    <td>${item.cantidad}</td>
                    <td>${item.marca}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
    stockDiv.appendChild(table);
}

// Configurar el filtro para sugerencias de marca
function setupFilter() {
    const filterInput = document.getElementById('filterInput');
    const suggestionsContainer = document.getElementById('suggestionsContainer2');

    filterInput.addEventListener('input', () => fetchMarcas(filterInput, suggestionsContainer));
    filterInput.addEventListener('keydown', (e) => navigateSuggestions(e, suggestionsContainer));
    suggestionsContainer.addEventListener('click', (e) => selectSuggestion(e, filterInput, suggestionsContainer));
}

// Función para obtener marcas y mostrar sugerencias
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

// Función para navegar sugerencias con teclado
let selectedIndex = -1;

const navigateSuggestions = (e, container) => {
    const items = container.querySelectorAll('.suggestion-item');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        highlightSuggestion(items, selectedIndex);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        highlightSuggestion(items, selectedIndex);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
            items[selectedIndex].click();
        }
    }
};

// Función para resaltar sugerencias
const highlightSuggestion = (items, index) => {
    items.forEach((item, i) => {
        item.classList.toggle('highlighted', i === index);
    });
};

// Función para seleccionar una sugerencia
const selectSuggestion = (e, input, container) => {
    if (e.target.classList.contains('suggestion-item')) {
        input.value = e.target.textContent;
        container.style.display = 'none';
        filterTable(input.value); // Filtrar la tabla automáticamente
    }
};

// Función para filtrar la tabla
function filterTable(filterValue) {
    const filteredData = Object.values(window.acumulado).filter(item =>
        item.marca.toLowerCase().includes(filterValue.toLowerCase())
    );
    renderTable(filteredData);
}


