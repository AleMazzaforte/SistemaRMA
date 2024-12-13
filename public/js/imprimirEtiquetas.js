document.addEventListener('DOMContentLoaded', () => {
    const btnImprimir = document.getElementById('botonImprimir');
    const inputCantidadBultos = document.getElementById('bultos');

    // Función para manejar la impresión
    const handlePrint = () => {
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
            cuit: document.getElementById('remitenteCuit').textContent,
            direccion: document.getElementById('remitenteDireccion').textContent,
            telefono: document.getElementById('remitenteTelefono').textContent
        };

        fetch('/imprimirEtiquetas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cliente, remitente, cantidadBultos })
        })
        .then(response => response.json())
        .then(data => {
            const base64PDF = data.base64;
            const pdfWindow = window.open("");
            if (pdfWindow) {
                pdfWindow.document.write(
                    `<iframe id='pdfFrame' width='100%' height='100%' src='data:application/pdf;base64,${base64PDF}'></iframe>`
                );
                const pdfFrame = pdfWindow.document.getElementById('pdfFrame');
                setTimeout(() => {
                    pdfFrame.onload = () => {
                        pdfWindow.print();
                    };
                }, 500);
            } else {
                console.error('Error al crear la ventana del navegador');
                alert('Error al crear la ventana del navegador');
            }
        })
        .catch(error => {
            console.error('Error al imprimir:', error);
            alert('Error al imprimir las etiquetas');
        });
    };

    // Event listener para el botón de imprimir
    btnImprimir.addEventListener('click', handlePrint);

    // Event listener para detectar Enter en el input de cantidad de bultos
    inputCantidadBultos.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Evita el comportamiento por defecto del Enter
            handlePrint();
        }
    });
});







