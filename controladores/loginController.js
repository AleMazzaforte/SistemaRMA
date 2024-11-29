require('dotenv').config();
const { conn } = require('../bd/bd'); // Importa la conexión
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
    getLogin: (req, res) => {
        res.render('login');
    },

    postLogin: async (req, res) => {
        const { username, password } = req.body;

        const query = 'SELECT * FROM usuarios WHERE nombre = ?';
        

        try {
            // Usa la conexión directamente
            const [results] = await conn.query(query, [username]);
            if (results.length > 0) {
                const user = results[0];
                const match = await bcrypt.compare(password, user.password);

                if (match) {
                    // Generar el token
                    const token = jwt.sign({ id: user.id, username: user.nombre }, SECRET_KEY, { expiresIn: '1h' });

                    // Enviar el token al cliente para que lo almacene
                    res.cookie('token', token, { httpOnly: true }); // Guardar el token en una cookie segura
                    return res.render('index');
                } else {
                    return res.status(401).render('login', { error: 'Credenciales incorrectas' });
                }
            } else {
                return res.status(401).render('login', { error: 'Usuario no encontrado' });
            }
        } catch (error) {
            console.error('Error en la consulta a la base de datos:', error);
            return res.status(500).send('Error en el servidor');
        } 
            // No necesitas liberar la conexión aquí porque el pool maneja las conexiones automáticamente
        
    },

    logout: (req, res) => {
        res.clearCookie('token'); // Borrar el token de las cookies
        res.json({ message: 'Logout exitoso' });
    },

    isAuthenticated: (req, res, next) => {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).render('login', { error: 'Acceso denegado. Por favor, inicie sesión.' });
        }

        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).render('login', { error: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.' });
        }
    }
};
