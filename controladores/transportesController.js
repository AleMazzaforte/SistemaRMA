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
        res.render('cargarTransporte')
    },

    postActualizarTransporte: async (req, res) => {
        const idTransporte = req.params.idTransporte;
        const [datos] = req.body;
        const sql = `UPDATE transportes SET nombre = ?, direccionLocal = ?, telefono = ? WHERE idTransporte = ${idTransporte} VALUES (?, ?, ?, ?)`;
        conn.query(sql, datos.nombre, datos.direccionLocal, datos.telefono )
        res.render('cargarTransporte')
    },

    postEliminarTransporte: async (req, res) => {
        const sql = `DELETE FROM transportes WHERE idTransporte = ?`
    }
     
}
