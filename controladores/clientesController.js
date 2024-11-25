const { conn } =  require('../bd/bd');



module.exports = {
    postAgregarClienteForm: (req, res) => {
        const {  nombre, cuit, provincia, ciudad, domicilio, telefono, transporte, seguro, condicionDeEntrega } = req.body;
        try {
            const query = `INSERT INTO clientes ( nombre, cuit, provincia, ciudad, domicilio, telefono, transporte, seguro, condicionDeEntrega)  VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            conn.query(query, [ nombre, cuit, provincia, ciudad, domicilio, telefono, transporte, seguro,  condicionDeEntrega], (err, results) => {
                if (err) {
                    console.error('Error al ingresar  cliente', err);
                    return res.status(500).send('Error al cargar  cliente');
                }
                res.redirect('/')
                return;
            });

        }
        catch (error) {
            console.error('Error encriptando la contraseña:', error);
            res.status(500).send('Error interno del servidor');
            return;
        }
        
        
        
        // Redirigir o enviar respuesta
        res.redirect('/')
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
            console.log('Consulta SQL:', query, [nombre, cuit, provincia, ciudad, domicilio, telefono, transporte, seguro, condicionDeEntrega, id]); // Agrega este log
            conn.query(query, [nombre, cuit, provincia, ciudad, domicilio, telefono, transporte, seguro, condicionDeEntrega, id], (err, results) => {
                console.log( 'result',  results)
                if (err) {
                    console.error('Error al actualizar cliente:', err);
                    return res.status(500).send('Error al actualizar cliente');
                }
                console.log('Resultado de la query:', results);
                res.json({message: 'Cliente actualizado correctamente'})
            });
        } catch (error) {
            console.error('Error interno del servidor:', error);
            res.status(500).send('Error interno del servidor');
        }
    },
    
}
