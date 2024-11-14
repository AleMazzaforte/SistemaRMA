const { conn } =  require('../bd/bd');


module.exports = {
    getAgregarTransporte: (req, res) => {
        res.render('cargarTransporte')
    },
    
    postAgregarTransporte: async (req, res) => {
               
        const sql = `INSERT INTO transportes (nombre, direccionLocal, telefono) VALUES (?, ?, ?)`;
        const query = await conn.query(sql, [req.body.nombre, req.body.direccionLocal, req.body.telefono])
        console.log('query en agregar', query)
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
        await conn.query(sql, [nombre, direccionLocal, telefono, idTransporte]);  // Ejecuta la consulta con los datos
        
        res.redirect('/gestionarTransporte');  // Redirige a la lista de transportes después de la actualización
    },
    
    postEliminarTransporte: async (req, res) => {
        const idTransporte = req.params.idTransporte;  // Captura el idTransporte desde los parámetros
        
        const sql = `DELETE FROM transportes WHERE idTransporte = ?`;  // Consulta SQL para eliminar
        await conn.query(sql, [idTransporte]);  // Ejecuta la consulta con el id
        
        res.redirect('/listarTransportes');  // Redirige a la lista de transportes después de la eliminación
    }
     
}
