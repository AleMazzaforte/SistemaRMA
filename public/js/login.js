

  
  // Script para mostrar un alert si hay error en el login
  window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('error')) {
        alert('Usuario o contraseña incorrectos. Inténtelo de nuevo.');
    }   
  }

