const { conn } =  require('../bd/bd');
const bcrypt = require('bcrypt')

module.exports = {
    getLogin: (req, res) => {
        res.render('login');
    },

    postLogin: async (req, res) => {
        const { username, password } = req.body;

        // Consulta SQL para verificar si el usuario existe
        const query = 'SELECT * FROM usuarios WHERE nombre = ?';

        try {
            const [results] = await conn.execute(query, [username]);
            if (results.length > 0) {
                // Si se encuentra el usuario, comparar las contraseñas
                const user = results[0]; // Obtener el primer resultado
                const match = await bcrypt.compare(password, user.password);

                if (match) {
                    // Si las contraseñas coinciden
                    req.session.usuario = username;  // Almacenar el nombre de usuario en la sesión
                    req.session.isAuthenticated = true;  // Marcar que está autenticado
                    return res.redirect('/');
                } else {
                    // Si la contraseña no coincide
                    return res.redirect('/login?error=1');  // Redirigir al login con un mensaje de error
                }
            } else {;
                // Si no se encuentra el usuario
                return res.redirect('/login?error=1');  // Redirigir al login con un mensaje de error
            }
        } catch (error) {
            console.error('Error en la consulta a la base de datos:', error);
            return res.status(500).send('Error en el servidor');
        }
    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Error al cerrar sesión');
            }
            res.redirect('/login');
        });
    },

    isAuthenticated: (req, res, next) => {
        
        if (req.session.isAuthenticated) {  // Verificar si está autenticado
            return next();
        } else {
            res.redirect('/login');
        }
    }
};
