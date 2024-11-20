require('dotenv').config(); 
const { conn } = require('../bd/bd');
const bcrypt = require('bcrypt');
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
            const [results] = await conn.execute(query, [username]);
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
    },
    

    logout: (req, res) => {
        // Con JWT, no se requiere una lógica de logout en el servidor
        res.json({ message: 'Logout exitoso (implementar en cliente borrando el token)' });
    },

    isAuthenticated: (req, res, next) => {
        const token = req.cookies.token; // Leer el token de las cookies
    
        if (!token) {
            // Redirigir al login si no hay token
            return res.status(401).render('login', { error: 'Acceso denegado. Por favor, inicie sesión.' });
        }
    
        try {
            const decoded = jwt.verify(token, SECRET_KEY); // Validar el token
            req.user = decoded; // Almacenar los datos decodificados del token
            next();
        } catch (error) {
            // Redirigir al login si el token es inválido o ha expirado
            return res.status(401).render('login', { error: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.' });
        }
    }
    
    
};
