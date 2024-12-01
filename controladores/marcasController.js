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
        const query = 'SELECT nombre FROM marcas'; 
        let connection; 
        
        try { connection = await conn.getConnection(); 
            const [rows] = await connection.query(query); 
            const marcas = rows.map(row => row.nombre); 
            res.json({ success: true, marcas }); 
        } catch (error) { console.error('Error al listar marcas:', error); 
            res.status(500).send('Error al listar marcas'); 
        } finally { if (connection) connection.release(); 

        } 
    }
};
