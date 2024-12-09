document.addEventListener('DOMContentLoaded', () => {
    const btnImprimir = document.getElementById('botonImprimir');
    const etiquetasContainer = document.getElementById('etiquetasContainer');
    const formCliente = document.getElementById('formCliente');
    const formBultos = document.getElementById('formBultos');
    const datosCliente = document.getElementById('datosCliente');
    const remitenteTable = document.getElementById('remitente');
    const header = document.querySelector('.header');
    const footer = document.getElementById('footer');
    const h1= document.getElementById('h1');


    btnImprimir.addEventListener('click', () => {
        const cantidadBultos = parseInt(document.getElementById('bultos').value);
        const cliente = {
            nombre: document.getElementById('nombre').value,
            cuit: document.getElementById('cuit').value,
            provincia: document.getElementById('provincia').value,
            ciudad: document.getElementById('ciudad').value,
            direccion: document.getElementById('direccion').value,
            telefono: document.getElementById('telefono').value,
            seguro: document.getElementById('seguro').value,
            condicionDeEntrega: document.getElementById('entrega').value,
            condicionDePago: document.getElementById('pago').value
        };
        const remitente = {
            nombre: document.getElementById('remitenteNombre').textContent,
            direccion: document.getElementById('remitenteDireccion').textContent,
            telefono: document.getElementById('remitenteTelefono').textContent,
            email: document.getElementById('remitenteEmail').textContent
        };
        generarEtiquetas(cliente, remitente, cantidadBultos);
        
        // Ocultar elementos no deseados para imprimir
        formCliente.style.display = 'none';
        formBultos.style.display = 'none';
        datosCliente.style.display = 'none';
        footer.style.display = 'none';
        header.style.display = 'none';
        h1.style.display = 'none';

        // Mostrar el contenedor de etiquetas
        etiquetasContainer.classList.remove('hidden');

        // Esperar un momento para asegurar que los estilos se apliquen antes de imprimir
        setTimeout(() => {
            window.print();

            // Restaurar la visibilidad de los elementos ocultos después de imprimir
            formCliente.style.display = '';
            formBultos.style.display = '';
            datosCliente.style.display = '';

            // Ocultar nuevamente el contenedor de etiquetas
            etiquetasContainer.classList.add('hidden');
        }, 1000);
    });

    function generarEtiquetas(cliente, remitente, cantidadBultos) {
        etiquetasContainer.innerHTML = ''; // Limpiar etiquetas anteriores
        for (let i = 1; i <= cantidadBultos; i++) {
            const etiqueta = document.createElement('div');
            etiqueta.classList.add('etiqueta');
            etiqueta.innerHTML = `
                <div>Cliente: <strong>${cliente.nombre}</strong></div>
                <div>CUIT: <strong>${cliente.cuit}</strong></div>
                <div>Provincia: <strong>${cliente.provincia}</strong></div>
                <div>Ciudad: <strong>${cliente.ciudad}</strong></div>
                <div>Dirección: <strong>${cliente.direccion}</strong></div>
                <div>Teléfono: <strong>${cliente.telefono}</strong></div>
                <div>Seguro: <strong>${cliente.seguro}</strong></div>
                <div>Entrega: <strong>${cliente.condicionDeEntrega}</strong></div>
                <div>Pago: <strong>${cliente.condicionDePago}</strong></div>
                
                <div>Remitente: <strong>${remitente.nombre}</strong></div>
                <div>Dirección: <strong>${remitente.direccion}</strong></div>
                <div>Teléfono: <strong>${remitente.telefono}</strong></div>
                <div>Email: <strong>${remitente.email}</strong></div>
                <div class="pieEtiqueta">BULTOS <strong>${i}</strong> de <strong>${cantidadBultos}</strong></div>
            `;
            etiquetasContainer.appendChild(etiqueta);
        }
    }
});

