const { conn } =  require('../bd/bd');



module.exports = {
    getAgregarTransporte: (req, res) => {
        res.render('cargarTransporte')
    },
    
    postAgregarTransporte: async (req, res) => {
               
        const sql = `INSERT INTO transportes (nombre, direccionLocal, telefono) VALUES (?, ?, ?)`;
        const query = await conn.query(sql, [req.body.nombre, req.body.direccionLocal, req.body.telefono])
        res.render('cargarTransporte')
    },

    getListarTransportes: async (req, res) => {
        
        const sql = `SELECT idTransporte, nombre, direccionLocal, telefono FROM transportes`;
        const [query] = await conn.query(sql);
        res.json(query);
        
    },

    getGestionarTransportes: (req, res) => {
        let transporte = {};
        res.render('cargarTransporte', { transporte: transporte });
    },

    postActualizarTransporte: async (req, res) => {
        const idTransporte = req.params.idTransporte;
        const { nombre, direccionLocal, telefono } = req.body;  // Captura los datos del body
    
        const sql = `UPDATE transportes SET nombre = ?, direccionLocal = ?, telefono = ? WHERE idTransporte = ?`;  // Consulta SQL para actualizar
    
        try {
            await conn.query(sql, [nombre, direccionLocal, telefono, idTransporte]);  // Ejecuta la consulta con los datos
            res.redirect('/gestionarTransporte');  // Redirige después de la actualización
        } catch (error) {
            console.error('Error al actualizar el transporte:', error);
            res.status(500).send('Ocurrió un error al intentar actualizar el transporte');  // Muestra un mensaje de error si ocurre algún problema
        }
    },    
    
    postEliminarTransporte: async (req, res) => {
        const idTransporte = req.params.idTransporte;  // Captura el idTransporte desde los parámetros
        const sql = `DELETE FROM transportes WHERE idTransporte = ?`;  // Consulta SQL para eliminar
    
        try {
            await conn.query(sql, [idTransporte]);  // Ejecuta la consulta con el id
            res.redirect('/gestionarTransporte');  // Redirige a la lista de transportes después de la eliminación
        } catch (error) {
            console.error('Error al eliminar el transporte:', error);  // Muestra el error en la consola
            res.status(500).send('Ocurrió un error al intentar eliminar el transporte');  // Envía una respuesta de error al cliente
        }
    }
    
     
}
