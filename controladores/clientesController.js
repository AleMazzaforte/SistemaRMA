const { conn } = require('../bd/bd');

module.exports = {

    postAgregarClienteForm: async (req, res) => { 
        const { nombre, cuit, provincia, ciudad, domicilio, telefono, transporte, seguro, condicionDeEntrega } = req.body; 
        let connection; 
        try { 
            connection = await conn.getConnection(); 
            // Obtén la conexión del pool 
            const query = `INSERT INTO clientes (nombre, cuit, provincia, ciudad, domicilio, telefono, transporte, seguro, condicionDeEntrega) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`; 
            // Manejar valor vacío para teléfono 
            const telefonoValue = telefono.trim() === '' ? null : telefono; 
            const [results] = await connection.query(query, [nombre, cuit, provincia, ciudad, domicilio, telefonoValue, transporte, seguro, condicionDeEntrega]); 
            res.redirect('/'); 
        } catch (error) { 
            console.error('Error interno del servidor:', error); 
            res.status(500).send('Error interno del servidor'); 
        } finally { 
            if (connection) connection.release(); // Libera la conexión 
            } 
    },

    getListarClientes: async (req, res) => {
        let connection;
        try {
            connection = await conn.getConnection(); // Obtén la conexión del pool
            const query = 'SELECT id, nombre, cuit, provincia, ciudad, domicilio, telefono, transporte, seguro, condicionDeEntrega FROM clientes';
            const [results] = await connection.query(query);  // Usando async/await
            res.json(results);  // Enviar resultados como JSON para que el frontend los reciba
            
        } catch (error) {
            console.error('Error al listar clientes:', error);
            res.status(500).send('Error al listar clientes');
        } finally {
            if (connection) connection.release(); // Libera la conexión
        }
    },

    postActualizarCliente: async (req, res) => {
        const { nombre, cuit, provincia, ciudad, domicilio, telefono, transporte, seguro, condicionDeEntrega } = req.body;
        const { id } = req.params; // Obtener el ID del cliente desde los parámetros de la URL
        

        let connection;
        try {
            connection = await conn.getConnection(); // Obtén la conexión del pool
            const query = `UPDATE clientes SET nombre = ?, cuit = ?, provincia = ?, ciudad = ?, domicilio = ?, telefono = ?, transporte = ?, seguro = ?, condicionDeEntrega = ? WHERE id = ?`;
            const [results] = await connection.query(query, [nombre, cuit, provincia, ciudad, domicilio, telefono, transporte, seguro, condicionDeEntrega, id]);

            if (results.affectedRows === 0) {
                return res.status(400).json({ message: 'No se realizaron cambios en el cliente' });
            }

            res.json({ message: 'Cliente actualizado correctamente' });
        } catch (error) {
            console.error('Error al actualizar cliente:', error);
            res.status(500).json({ message: 'Error al actualizar cliente' });
        } finally {
            if (connection) connection.release(); // Libera la conexión
        }
    },

    postEliminarCliente: async (req, res) => { 
        const { id } = req.params; let connection; 
        try { connection = await conn.getConnection(); // Obtén la conexión del pool
             const query = `DELETE FROM clientes WHERE id = ?`; 
             const [results] = await connection.query(query, [id]); 
             if (results.affectedRows === 0) { 
                return res.status(400).json({ message: 'Cliente no encontrado' }); 
            } res.json({ message: 'Cliente eliminado correctamente' }); 
        } catch (error) { 
            console.error('Error al eliminar cliente:', error);
            res.status(500).json({ message: 'Error al eliminar cliente' }); 
        } finally { 
            if (connection) connection.release(); // Libera la conexión 
            }
        }
};
