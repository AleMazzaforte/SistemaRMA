const rutaActual = window.location.pathname;
console.log('ruta', rutaActual);



document.addEventListener('DOMContentLoaded', async () => {
    const listarTransporte = await fetch('/listarTransportes');
    const listaTransportes = await listarTransporte.json();
    console.log('lista transporte', listaTransportes);

    const inputNombre = document.getElementById('nombre');
    const inputDireccion = document.getElementById('direccionLocal');
    const inputTelefono = document.getElementById('telefono');
    const inputIdTransporte = document.getElementById('idTransporte');
    const suggestionsContainer = document.querySelector('#suggestionsContainer1');
    

    let selectedIndex = -1;

    inputNombre.addEventListener('input', () => {
        suggestionsContainer.innerHTML = '';
        selectedIndex = -1;
        
        const query = inputNombre.value.toLowerCase();

        if (query.length > 1) {
            const filteredTransportes = listaTransportes.filter(transporte =>
                transporte.nombre.toLowerCase().includes(query)
            );

            suggestionsContainer.style.display = 'grid';

            filteredTransportes.forEach((transporte, index) => {
                const suggestionElement = document.createElement('div');
                suggestionElement.classList.add('suggestion', 'suggestion-item'); // Añadimos las clases necesarias
                suggestionElement.textContent = transporte.nombre;

                suggestionElement.setAttribute('data-id', transporte.idTransporte);
                suggestionElement.setAttribute('data-index', index);
                suggestionElement.setAttribute('data-direccion', transporte.direccionLocal);
                suggestionElement.setAttribute('data-telefono', transporte.telefono);
                

                suggestionsContainer.appendChild(suggestionElement);
            });
        } else {
            suggestionsContainer.style.display = 'none';
        }
    });

    suggestionsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('suggestion')) {
            const selectedId = event.target.getAttribute('data-id');
            const selectedNombre = event.target.textContent;
            const selectedDireccion = event.target.getAttribute('data-direccion');
            const selectedTelefono = event.target.getAttribute('data-telefono');

            // Insertar valores en los inputs
            inputNombre.value = selectedNombre;
            inputDireccion.value = selectedDireccion;
            inputTelefono.value = selectedTelefono;
            inputIdTransporte.value = selectedId;

            //document.querySelectorAll('.cargarTransporte').forEach(e => e.style.display = 'grid');
            
            suggestionsContainer.style.display = 'none';
        }
    });

    // Código para navegar por las sugerencias con flechas y seleccionar con Enter
    inputNombre.addEventListener('keydown', (event) => { console.log('evento', event.key)
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();  // Evitar que el navegador maneje las teclas
        }
        const suggestions = document.querySelectorAll('.suggestion');
        if (event.key === 'ArrowDown') {
            if (selectedIndex < suggestions.length - 1) {
                selectedIndex++;
                highlightSuggestion(suggestions[selectedIndex]);
                
            }
        } else if (event.key === 'ArrowUp') {
            if (selectedIndex > 0) {
                selectedIndex--;
                highlightSuggestion(suggestions[selectedIndex]);
            }
        } else if (event.key === 'Enter') {
            console.log('selectedindex', selectedIndex)
            console.log(event.key)
            // Verificar si hay una sugerencia seleccionada
            if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                const selectedSuggestion = suggestions[selectedIndex]; // Utilizar la sugerencia seleccionada
                const selectedId = selectedSuggestion.getAttribute('data-id');
                const selectedNombre = selectedSuggestion.textContent;
                const selectedDireccion = selectedSuggestion.getAttribute('data-direccion');
                const selectedTelefono = selectedSuggestion.getAttribute('data-telefono');
                console.log('selected suggestion', selectedSuggestion);
                console.log(' suggestion index ', suggestions[selectedIndex]);
    
                // Insertar valores en los inputs
                inputNombre.value = selectedNombre;
                inputDireccion.value = selectedDireccion;
                inputTelefono.value = selectedTelefono;
                inputIdTransporte.value = selectedId;
                
                
                //document.querySelector('.gestionarTransporte').style.display = 'block';
                //suggestionsContainer.style.display = 'none'; // Ocultar las sugerencias después de la selección
            }
        }
    });
    
    document.getElementById('botonCargar').style.display = 'none'
    function highlightSuggestion(suggestion) {
        document.querySelectorAll('.suggestion').forEach(s => s.classList.remove('active'));
        suggestion.classList.add('active');
    }
});

// Ocultar y mostrar elementos
if (rutaActual === '/gestionarTransporte') {
    document.getElementById('h1').setAttribute('style', 'display: none !important');
    document.getElementById('botonCargar').setAttribute('style', 'display: none !important');
    
    let ocultarElementos = document.querySelectorAll('.cargarTransporte');
    let mostrarElementos = document.querySelector('.gestionarTransporte');

    ocultarElementos.forEach(elemento => {
        elemento.style.display = 'none';
    });
    
    mostrarElementos.style.display = 'block';
}