

document.addEventListener('DOMContentLoaded', () => {
    const clienteSearch = document.getElementById('clienteSearch');
    const suggestionsContainer = document.getElementById('suggestionsContainer1');
    const botonCargar = document.getElementById('botonCargar');
    let cargarProductos

    botonCargar.disabled = true; // Inicializar el botón como deshabilitado

    let highlightedIndex = -1; // Índice del elemento resaltado
    let clientes = []; // Almacena la lista de clientes
    let filteredClientes = []; // Almacena la lista filtrada de clientes

    const rutaActual = window.location.pathname;

    clienteSearch.addEventListener('input', async () => {
        const query = clienteSearch.value.trim();
        
        try {
            const response = await fetch(`/listarClientesRma`);
            clientes = await response.json(); // Guarda la lista de clientes
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.style.display = 'block';

            filteredClientes = clientes.filter(cliente => 
                cliente.nombre && typeof cliente.nombre === 'string' && cliente.nombre.toLowerCase().includes(query.toLowerCase())
            );

            filteredClientes.forEach(cliente => {
                const suggestion = document.createElement('div');
                suggestion.classList.add('suggestion-item');
                suggestion.textContent = cliente.nombre;

                suggestion.addEventListener('click', () => {
                    selectCliente(cliente); // Llama a la función para seleccionar el cliente
                });

                suggestionsContainer.appendChild(suggestion);
            });
            
        } catch (error) {
            console.error('Error fetching clientes:', error);
        }
    });

    // Manejar la navegación con flechas y selección
    clienteSearch.addEventListener('keydown', (e) => {
        const suggestionItems = document.querySelectorAll('.suggestion-item');
        if (e.key === 'ArrowDown') {
            highlightedIndex = (highlightedIndex + 1) % suggestionItems.length;
            updateHighlight(suggestionItems);
            e.preventDefault(); // Evitar el desplazamiento de la página
        } else if (e.key === 'ArrowUp') {
            highlightedIndex = (highlightedIndex - 1 + suggestionItems.length) % suggestionItems.length;
            updateHighlight(suggestionItems);
            e.preventDefault(); // Evitar el desplazamiento de la página
        } else if (e.key === 'Enter') {
            if (highlightedIndex >= 0 && suggestionItems[highlightedIndex]) {
                selectCliente(filteredClientes[highlightedIndex]); // Seleccionar el cliente resaltado de la lista filtrada
            }
        }
    });

    const updateHighlight = (items) => {
        items.forEach((item, index) => {
            if (index === highlightedIndex) {
                item.classList.add('highlighted'); // Agregar clase para resaltar
                item.scrollIntoView({ block: 'nearest' }); // Desplazar para mostrar el resaltado
            } else {
                item.classList.remove('highlighted'); // Remover resaltado
            }
        });
    };

    const selectCliente = (cliente) => {
        clienteSearch.value = cliente.nombre; // Poner el nombre en el input
        document.getElementById('idCliente').value = cliente.id;  // Guarda el ID del cliente seleccionado en el campo oculto
        suggestionsContainer.style.display = 'none';

        if (rutaActual == '/agregarRma') {
            document.querySelectorAll('.campoOculto').forEach(campo => {
                campo.classList.remove('campoOculto'); // Eliminar la clase que oculta los campos
            });
        }

        // Deshabilitar la selección por flechas
        // clienteSearch.removeEventListener('keydown', clienteSearch); // Elimina el listener de keydown
        // if (rutaActual == '/gestionarRma') {
        //     cargarProductos(cliente.id);
        // }
    };

    document.addEventListener('click', (e) => {
        if (!suggestionsContainer.contains(e.target) && e.target !== clienteSearch) {
            suggestionsContainer.style.display = 'none';
        }
    });
});

// Asociar la función de envío al botón directamente
const formRma = document.getElementById('formRma');

async function enviarFormulario(event) {
    event.preventDefault();
    
    const cliente = document.getElementById('clienteSearch').value.trim();
    const modelo = document.getElementById('modelo').value.trim();
    const cantidad = document.getElementById('cantidad').value.trim();
    const marca = document.getElementById('marca').value.trim();
    const solicita = document.getElementById('solicita').value.trim();
    if (!cliente || !modelo || !cantidad || !marca || !solicita) {
        alert('Por favor, completa todos los campos requeridos antes de continuar.');
        return;
    }
    
    const formData = new FormData();
    formData.append('cliente', cliente);
    formData.append('modelo', modelo);
    formData.append('cantidad', cantidad);
    formData.append('marca', marca);
    formData.append('solicita', solicita);

    const camposOpcionales = ['opLote', 'vencimiento', 'seEntrega', 'seRecibe', 'observaciones', 'nIngreso', 'nEgreso', 'idCliente'];
    camposOpcionales.forEach(campo => {
        const inputElement = document.getElementById(campo);
        const valorCampo = inputElement.value.trim();
        if (valorCampo !== '') {
            formData.append(campo, valorCampo);
        }
    });

    try {
        console.log('Datos enviados:', Array.from(formData.entries()));

        const response = await fetch('/agregarRma', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        let result;
        try {
            result = await response.json();
        } catch (jsonError) {
            console.error('Error al parsear JSON:', jsonError);
            alert('Error en el formato de respuesta del servidor.');
            return;
        }

        console.log('result:', result);

        if (result.success) {
            alert('RMA cargado correctamente');
            formRma.reset();
        } else {
            alert(`Error: ${result.message || 'Ocurrió un problema.'}`);
        }
    } catch (error) {
        console.error('Error al cargar RMA:', error);
        alert('Ocurrió un error al cargar RMA. Intenta de nuevo más tarde.');
    }
}
