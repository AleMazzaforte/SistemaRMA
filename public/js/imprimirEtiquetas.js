const rutaActual = window.location.pathname;

if (rutaActual == '/imprimirEtiqueta') {
    document.getElementById('tituloImprimir').style.display = 'block'
    document.getElementById('tituloCargar').style.display = 'none'

}