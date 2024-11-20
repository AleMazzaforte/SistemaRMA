const { conn } = require('../bd/bd');
const { postActualizarCliente } = require('./clientesController');



// Funciones para formatear fechas
const formatFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

const formatFechaInput = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

module.exports = {
    getGestionarRma: async (req, res) => {
        try {
            // Define la variable productos como un array vacío
            const productos = [];
            res.render('rma', { productos });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener productos');
        }
    },
    

    getListarProductosRma :  async (req, res) => {
        const idCliente = req.params.idCliente;
         // Función para obtener productos por cliente
        const obtenerProductosPorCliente = async (idCliente) => {
            const query = `
                SELECT idRma, modelo, cantidad, marca, solicita, opLote, vencimiento, 
                    seEntrega, seRecibe, observaciones, nIngreso, nEgreso 
                FROM r_m_a 
                WHERE idCliente = ?`;
            const [rows] = await conn.execute(query, [idCliente]);
            return rows;
        };

        try {
            let productos = await obtenerProductosPorCliente(idCliente);
              // Formateo de datos
            productos = productos.map((producto) => ({
            modelo: producto.modelo || '',
            cantidad: producto.cantidad || '',
            marca: producto.marca || '',
            solicita: formatFecha(producto.solicita) || '',
            opLote: producto.opLote || '',
            vencimiento: formatFecha(producto.vencimiento || ''),
            seEntrega: formatFecha(producto.seEntrega) || '',
            seRecibe: formatFecha(producto.seRecibe) || '',
            observaciones: producto.observaciones || '',
            nIngreso: producto.nIngreso || '',
            nEgreso: producto.nEgreso || '',
            idRma: producto.idRma || ""
        }));


            res.json(productos);
        } catch (error) {
            console.error('Error al listar productos:', error);
            res.status(500).json({ error: 'Error al listar productos' });
        }

        // Función para formatear fecha a dd/mm/aaaa
        function formatFecha(fecha) {
            if (!fecha) return ''; // Retorna vacío si es null o undefined
            const date = new Date(fecha);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }

        // Función para formatear fecha a aaaa-mm-dd para los inputs
        function formatFechaInput(fecha) {
            if (!fecha) return ''; // Retorna vacío si es null o undefined
            const date = new Date(fecha);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }        
    },

        // Actualizar los datos de un producto específico
    postActualizarCliente: async (req, res) => {
        const idRma = req.params.idRma;
        const { modelo, cantidad, marca, solicita, opLote, vencimiento, seEntrega, seRecibe, observaciones, nIngreso, nEgreso } = req.body;

        // Log para verificar los datos que se reciben
        
        try {
            
            const query = `
                UPDATE r_m_a
                SET modelo = ?, cantidad = ?, marca = ?, solicita = ?, opLote = ?, 
                    vencimiento = ?, seEntrega = ?, seRecibe = ?, observaciones = ?, 
                    nIngreso = ?, nEgreso = ?
                WHERE idRma = ?`;

            
            conn.query(query, [modelo, cantidad, marca, solicita, opLote, vencimiento, seEntrega, seRecibe, observaciones, nIngreso, nEgreso, idRma], (error, results) => {
                if (error) {
                    console.error('Error al actualizar producto:', error);
                    return res.status(500).json({ error: 'Error al actualizar producto' });
                }
                console.log('Producto actualizado con éxito');
                res.json({ success: true });
            });
        } catch (error) {
            console.error('Error al procesar la actualización:', error);
            res.status(500).json({ error: 'Error al procesar la actualización' });
        }
    },

    postEliminarProducto: async (req, res) => {
        const { idRma } = req.params;
        
        if (!idRma) {
            return res.status(400).json({ error: 'ID de producto no proporcionado' });
        }
        
        try {
            const query = 'DELETE FROM r_m_a WHERE idRma = ?';
            const [result] = await conn.execute(query, [idRma]);
            
            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Producto eliminado exitosamente' });
            } else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    },
    


    
}
