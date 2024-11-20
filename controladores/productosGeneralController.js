const { conn } = require('../bd/bd'); 





module.exports = { 
    cargarProductos: (req, res) => {
    // Renderiza el archivo EJS
    res.render('cargarProductos'); 
    },

    agregarProductoNuevo: async (req, res) => {
        const { sku, marca, descripcion, rubro } = req.body; // Extrae los datos del formulario

        // Lógica para insertar el producto en la base de datos
        const query = 'INSERT INTO productos (sku, marca, descripcion, rubro) VALUES (?, ?, ?, ?)';

        try {
            
            // Usa await para ejecutar la consulta
            await conn.query(query, [sku, marca, descripcion, rubro]);
            // Redirige a la página de carga de productos después de agregar exitosamente
            res.redirect('/cargarProductos');
        } catch (err) {
            console.error('Error al agregar el producto:', err);
            return res.status(500).send('Error al agregar el producto');
        }
    },

    getListarProductos: async (req, res) => {
        try {
            const query = 'SELECT id, sku, descripcion, marca, rubro FROM productos';
            const [results] = await conn.query(query);
            res.json(results);
            
        } catch (error) {
            console.error('Error al listar productos:', error);
            res.status(500).send('Error al listar productos');
        }
    },

    actualizarProducto: async (req, res) => {
        const { sku, marca, descripcion, rubro  } = req.body;
        const { id } = req.params;  
        const query = 'UPDATE productos SET sku = ?, marca = ?, descripcion = ?, rubro = ? WHERE id = ?';

        try {
            await conn.query(query, [sku,  marca, descripcion, rubro, id]);
            res.json({ success: true, message: 'Producto actualizado correctamente' });
        } catch (err) {
            console.error('Error al actualizar el producto:', err);
            res.status(500).send('Error al actualizar el producto');
        }
    },
    

    eliminarProducto: async (req, res) => {
        const { sku } = req.body;
        const query = 'DELETE FROM productos WHERE sku = ?';
        console.log('req.body', req.body)
        try {
            await conn.query(query, [sku]);
            res.json({ success: true, message: 'Producto eliminado correctamente' });
        } catch (err) {
            console.error('Error al eliminar el producto:', err);
            res.status(500).send('Error al eliminar el producto');
        }
    }
    
}
