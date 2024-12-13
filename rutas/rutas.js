const express = require('express');
const router = express.Router();
const authController = require('../controladores/loginController');
const mainController = require('../controladores/mainController');
const usuarioController = require('../controladores/usuarioController.js');
const cliente = require('../controladores/clientesController.js');
const estadisticas = require('../controladores/estadisticasController.js');
const productosGeneralController = require('../controladores/productosGeneralController');
const cargarRma = require('../controladores/cargarRmaController.js');
const gestionarRma = require('../controladores/gestionarRmaController.js');
const transportesController = require('../controladores/transportesController.js')
const imprimirEtiqueta = require('../controladores/etiquetasController.js');
const stockController = require('../controladores/stockController.js')
const marcas = require('../controladores/marcasController.js')
const cargarOp = require('../controladores/OpController.js')

router.get('/', authController.isAuthenticated, mainController.getIndex)

router.get('/login', authController.getLogin);  // Muestra el formulario de login
router.post('/login', authController.postLogin);  // Procesa el formulario de login

// Ruta para logout
router.get('/logout', authController.logout);  // Lógica de logout

// Ruta para mostrar el formulario de cargar usuario
router.get('/cargarUsuario', authController.isAuthenticated, usuarioController.cargarUsuarioForm);
// Ruta para procesar la carga del usuario
router.post('/cargarUsuario', authController.isAuthenticated, usuarioController.cargarUsuario);

//Ruta para agregar clientes
router.post('/agregarCliente', authController.isAuthenticated, cliente.postAgregarClienteForm);
//Ruta para actualizar clientes
router.post('/actualizarCliente/:id', authController.isAuthenticated, cliente.postActualizarCliente);
router.delete('/eliminarCliente/:id', authController.isAuthenticated, cliente.postEliminarCliente);

//Ruta para listar clientes 
router.get('/buscarCliente', authController.isAuthenticated, cliente.getListarClientes);



// RutaS para cargar productos 
router.get('/cargarProductos', authController.isAuthenticated, productosGeneralController.cargarProductos);

// Rutas para un nuevo producto
router.post('/agregarProductoNuevo', authController.isAuthenticated, productosGeneralController.agregarProductoNuevo);
router.get('/buscarProductos', authController.isAuthenticated, productosGeneralController.getListarProductos);
router.post('/actualizarProducto/:id', authController.isAuthenticated, productosGeneralController.actualizarProducto);
router.post('/eliminarProducto', authController.isAuthenticated, productosGeneralController.eliminarProducto);

// Rutas para cargar RMA
router.get('/agregarRma',  authController.isAuthenticated, cargarRma.getCargarRma);
router.get('/listarClientesRma', authController.isAuthenticated, cargarRma.getListarClientesRma);
router.post('/agregarRma', authController.isAuthenticated, cargarRma.postAgregarRma);

// Rutas para gestionar RMA
router.get('/gestionarRma', authController.isAuthenticated, gestionarRma.getGestionarRma);
router.get('/gestionarRma', authController.isAuthenticated, cargarRma.getListarClientesRma);
router.get('/listarProductosRma/:idCliente',  authController.isAuthenticated, gestionarRma.getListarProductosRma);
router.post('/actualizarProductoRma/:idRma', authController.isAuthenticated, gestionarRma.postActualizarCliente);
router.post('/eliminarProductoRma/:idRma', authController.isAuthenticated, gestionarRma. postEliminarProducto);

//Rutas para transportes
router.get('/agregarTransporte', authController.isAuthenticated, transportesController.getAgregarTransporte);
router.get('/listarTransportes', authController.isAuthenticated, transportesController.getListarTransportes);
router.post('/agregarTransporte', authController.isAuthenticated, transportesController.postAgregarTransporte);

//Rutas para gestionar transportes
router.get('/gestionarTransporte', authController.isAuthenticated, transportesController.getGestionarTransportes);
router.post('/actualizarTransporte/:idTransporte', authController.isAuthenticated, transportesController.postActualizarTransporte);
router.post('/eliminarTransporte/:idTransporte', authController.isAuthenticated, transportesController.postEliminarTransporte);

//Rutas para imprimir etiquetas
router.get('/imprimirEtiqueta', authController.isAuthenticated, imprimirEtiqueta.getImprimirEtiqueta);
router.post('/verificarRMAyBuscarCliente', authController.isAuthenticated, imprimirEtiqueta.verificarRMAyBuscarCliente); 
router.post('/imprimirEtiquetas', imprimirEtiqueta.imprimirEtiquetas);

//Rutas para marcas
router.get('/cargarMarcas', authController.isAuthenticated, marcas.getCargarMarcas);
router.post('/cargarMarcas', authController.isAuthenticated, marcas.postCargarMarcas);
router.get('/listarMarcas', authController.isAuthenticated, marcas.listarMarcas);


//Rutas para consultar stock
router.get('/stockEjs', authController.isAuthenticated, stockController.getStockEjs)
router.get('/stock', authController.isAuthenticated, stockController.getStock);

//Rutas para OP
router.get('/cargarOp', authController.isAuthenticated, cargarOp.getCargarOp);
router.post('/cargarOp', authController.isAuthenticated, cargarOp.postCargarOp);
// Nueva ruta para buscar OPs 
router.get('/actualizarOp', authController.isAuthenticated, cargarOp.getActualizarOp);
router.post('/actualizarOp', authController.isAuthenticated, cargarOp.postActualizarOp);
router.get('/buscarOps', authController.isAuthenticated, cargarOp.getListarOps); 
router.get('/detalleOp/:opId', authController.isAuthenticated, cargarOp.getDetalleOp);

//Rutas para estadisticas
router.get('/estadisticas', authController.isAuthenticated, estadisticas.getEstadisticasOp);
router.get('/descargarExcelLs', authController.isAuthenticated, estadisticas.getDescargarExcelLs);
router.get('/descargarExcelTj', authController.isAuthenticated, estadisticas.getDescargarExcelTj);

module.exports = router;
