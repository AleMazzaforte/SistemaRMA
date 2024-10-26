const { conn } = require('../bd/bd');  // Conexión a la base de datos
const bcrypt = require('bcrypt');

// Función para mostrar el formulario de cargar usuario
module.exports = {
    cargarUsuarioForm: (req, res) => {
        
        res.render('cargarUsuario');
    },

// Función para procesar y guardar el usuario en la base de datos
    cargarUsuario: async (req, res) => {
        const { username, password } = req.body;

        // Encriptar la contraseña antes de guardar
        try {
            // Encriptar la contraseña antes de guardar
            const hashedPassword = await bcrypt.hash(password, 10);

            const query = 'INSERT INTO usuarios (nombre, password) VALUES (?, ?)';

            conn.query(query, [username, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).send('Error al cargar usuario');
                }
                console.log('Usuario insertado:', result);
                res.redirect('/cargarUsuario');
                return;
            });
        } catch (error) {
            console.error('Error encriptando la contraseña:', error);
            res.status(500).send('Error interno del servidor');
            return;
        }
    }
}
