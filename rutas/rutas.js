const express = require('express');
const router = express.Router();
const authController = require('../controladores/loginController');
const mainController = require('../controladores/mainController');
const usuarioController = require('../controladores/usuarioController.js');
const cliente = require('../controladores/clientesController.js');
const productosGeneralController = require('../controladores/productosGeneralController');
const cargarRma = require('../controladores/cargarRmaController.js');
const gestionarRma = require('../controladores/gestionarRmaController.js');
const transportesController = require('../controladores/transportesController.js')
const imprimirEtiqueta = require('../controladores/etiquetasController.js');

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
router.post('/agregarCliente', authController.isAuthenticated, cliente.agregarClienteForm);
//Ruta para actualizar clientes
router.post('/actualizarCliente', authController.isAuthenticated, cliente.postActualizarCliente);

//Ruta para listar clientes
router.get('/buscarCliente', cliente.getListarClientes);

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

//Rutas para imprimir etiquetas
router.get('/imprimirEtiqueta', authController.isAuthenticated, imprimirEtiqueta.getImprimirEtiqueta);

module.exports = router;
