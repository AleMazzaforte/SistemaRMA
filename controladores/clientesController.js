const { conn } = require('../bd/bd');

conn.getConnection((err, connection) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos establecida');
    connection.release(); // Liberar la conexión
});


module.exports = {

    postAgregarClienteForm: async (req, res) => {
        const { nombre, cuit, provincia, ciudad, domicilio, telefono, transporte, seguro, condicionDeEntrega } = req.body;  
        try {
            const query = `INSERT INTO clientes (nombre, cuit, provincia, ciudad, domicilio, telefono, transporte, seguro, condicionDeEntrega) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`; 
           
             
            const [results] = await conn.query(query, [nombre, cuit, provincia, ciudad, domicilio, telefono, transporte, seguro, condicionDeEntrega]); 
            res.redirect('/'); 
        } 
        catch (error) {
            console.error('Error interno del servidor:', error);
            res.status(500).send('Error interno del servidor'); 
        }
    },


    getListarClientes: async (req, res) => {
        try {
            const query = 'SELECT id, nombre, cuit, provincia, ciudad, domicilio, telefono, transporte, seguro, condicionDeEntrega FROM clientes';
            const [results] = await conn.query(query);  // Usando async/await
            res.json(results);  // Enviar resultados como JSON para que el frontend los reciba
            return
        } catch (error) {
            console.error('Error al listar clientes:', error);
            res.status(500).send('Error al listar clientes');
        }
    },

    postActualizarCliente: (req, res) => {
        const { nombre, cuit, provincia, ciudad, domicilio, telefono, transporte, seguro, condicionDeEntrega } = req.body;
        const { id } = req.params; // Obtener el ID del cliente desde los parámetros de la URL
        console.log('Datos recibidos:', req.body);
        console.log('ID recibido:', id);

        try {
            const query = `UPDATE clientes SET nombre = ?, cuit = ?, provincia = ?, ciudad = ?, domicilio = ?, telefono = ?, transporte = ?, seguro = ?, condicionDeEntrega = ? WHERE id = ?`;
            console.log('Consulta ejecutada con éxito:', query, [nombre, cuit, provincia, ciudad, domicilio, telefono, transporte, seguro, condicionDeEntrega, id]);
            conn.query(query, [nombre, cuit, provincia, ciudad, domicilio, telefono, transporte, seguro, condicionDeEntrega, id], (err, results) => {
                console.log('result', results);
                if (results.affectedRows === 0) {
                    return res.status(400).json({ message: 'No se realizaron cambios en el cliente' });
                }

                if (err) {
                    console.error('Error al actualizar cliente:', err);
                    return res.status(500).json({ message: 'Error al actualizar cliente' });
                }
                console.log('Resultado de la query:', results);
                res.json({ message: 'Cliente actualizado correctamente' });
            });
        } catch (error) {
            console.error('Error interno del servidor:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    },



}
