const express = require('express');
const router = express.Router();
const authController = require('../controladores/loginController');
const mainController = require('../controladores/mainController');
const usuarioController = require('../controladores/usuarioController.js');
const cliente = require('../controladores/clientesController.js');
const productosGeneralController = require('../controladores/productosGeneralController');

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

// Ruta para cargar productos masivamente
router.post('/cargarProductos', authController.isAuthenticated, productosGeneralController.cargarProductos);



module.exports = router;
