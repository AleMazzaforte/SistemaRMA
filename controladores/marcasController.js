const { conn } = require('../bd/bd');

module.exports = {
    getCargarMarcas: (req, res) => {
        res.render('marcas');
    },

    postCargarMarcas: async (req, res) => {
        const { nombre } = req.body; // Extrae el valor del input del formulario

        const query = 'INSERT INTO marcas (nombre) VALUES (?)';
        let connection;

        try {
            connection = await conn.getConnection(); // Obtiene una conexión del pool
            await connection.query(query, [nombre]); // Ejecuta la consulta de inserción

            res.redirect('/cargarMarcas'); // Redirige a la página de cargar marcas después de guardar
        } catch (error) {
            console.error('Error al guardar la marca:', error);
            res.status(500).send('Error al guardar la marca');
        } finally {
            if (connection) connection.release(); // Libera la conexión
        }
    },

    listarMarcas: async (req, res) => { 
        try { 
            const connection = await conn.getConnection(); 
            const [results] = await connection.query('SELECT * FROM marcas'); 
            connection.release(); res.json(results); 
        } catch (error) { 
            console.error('Error al obtener las marcas:', error); 
            res.status(500).send('Error al obtener las marcas'); 
        } 
    }
};
