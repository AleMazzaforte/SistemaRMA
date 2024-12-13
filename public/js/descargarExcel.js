document.addEventListener('DOMContentLoaded', () => {
    const btnDescargarExcelLs = document.getElementById('descargarExcelLs');
    const btnDescargarExcelTj = document.getElementById('descargarExcelTj');

    btnDescargarExcelLs.addEventListener('click', () => {
        window.location.href = '/descargarExcelLs';
    });

    btnDescargarExcelTj.addEventListener('click', () => {
        window.location.href = '/descargarExcelTj';
    });
});
