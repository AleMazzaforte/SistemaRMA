const rutaActual = window.location.pathname;

// Ocultar y mostrar elementos
if (rutaActual === '/gestionarTransporte') {
    document.getElementById('h1').setAttribute('style', 'display: none !important');
    document.getElementById('botonCargar').disabled = true;
    document.getElementById('botonCargar').setAttribute('style', 'display: none !important');
    
    let ocultarElementos = document.querySelectorAll('.cargarTransporte');
    let mostrarElementos = document.querySelector('.gestionarTransporte');
    let transporte = ''
    ocultarElementos.forEach(elemento => {
        elemento.style.display = 'none';
    });
    
    
    mostrarElementos.style.display = 'block';

    
}


document.addEventListener('DOMContentLoaded', async () => {
    const listarTransporte = await fetch('/listarTransportes');
    const listaTransportes = await listarTransporte.json();
    

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

              // Cambiar el action del formulario para que apunte a la ruta de actualización
            const formTransporte = document.getElementById('formTransporte');
            formTransporte.setAttribute('action', `/actualizarTransporte/${selectedId}`);  // Ruta de actualización con el id
  

            document.querySelectorAll('.cargarTransporte').forEach(e => e.style.display = 'grid');
            
            suggestionsContainer.style.display = 'none';
        }
    });

    // Código para navegar por las sugerencias con flechas y seleccionar con Enter
    inputNombre.addEventListener('keydown', (event) => { //console.log('evento antes de todos', event.key)
        // if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        //     event.preventDefault();  // Evitar que el navegador maneje las teclas
        // }
        
        
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
            
            // Verificar si hay una sugerencia seleccionada
            if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                const selectedSuggestion = suggestions[selectedIndex]; // Utilizar la sugerencia seleccionada
                const selectedId = selectedSuggestion.getAttribute('data-id');
                const selectedNombre = selectedSuggestion.textContent;
                const selectedDireccion = selectedSuggestion.getAttribute('data-direccion');
                const selectedTelefono = selectedSuggestion.getAttribute('data-telefono');
                
                // Insertar valores en los inputs
                inputNombre.value = selectedNombre;
                inputDireccion.value = selectedDireccion;
                inputTelefono.value = selectedTelefono;
                inputIdTransporte.value = selectedId;
                
                  // Cambiar el action del formulario para que apunte a la ruta de actualización
                const formTransporte = document.getElementById('formTransporte');
                formTransporte.setAttribute('action', `/actualizarTransporte/${selectedId}`);  // Ruta de actualización con el id

                
                document.querySelectorAll('.cargarTransporte').forEach(e => e.style.display = 'grid');            
                suggestionsContainer.style.display = 'none';                
            }
        }
    });
    
    document.getElementById('botonCargar').style.display = 'none'
    function highlightSuggestion(suggestion) {
        document.querySelectorAll('.suggestion').forEach(s => s.classList.remove('active'));
        suggestion.classList.add('active');
    }
});


