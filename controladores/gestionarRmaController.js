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
            const productos = [];
            res.render('rma', { productos });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener productos');
        }
    },
    
    getListarProductosRma: async (req, res) => {
        const idCliente = req.params.idCliente;
        const obtenerProductosPorCliente = async (idCliente) => {
            const query = `
                SELECT idRma, modelo, cantidad, marca, solicita, opLote, vencimiento, 
                    seEntrega, seRecibe, observaciones, nIngreso, nEgreso 
                FROM r_m_a 
                WHERE idCliente = ?`;
            const [rows] = await conn.execute(query, [idCliente]);
            return rows;
        };

        let connection;
        try {
            connection = await conn.getConnection();
            let productos = await obtenerProductosPorCliente(idCliente);
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
                idRma: producto.idRma || ''
            }));
            res.json(productos);
        } catch (error) {
            console.error('Error al listar productos:', error);
            res.status(500).json({ error: 'Error al listar productos' });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },

    postActualizarCliente: async (req, res) => {
        const idRma = req.params.idRma;
        const { modelo, cantidad, marca, solicita, opLote, vencimiento, seEntrega, seRecibe, observaciones, nIngreso, nEgreso } = req.body;
        let connection;
        try {
            connection = await conn.getConnection();
            const query = `
                UPDATE r_m_a
                SET modelo = ?, cantidad = ?, marca = ?, solicita = ?, opLote = ?, 
                    vencimiento = ?, seEntrega = ?, seRecibe = ?, observaciones = ?, 
                    nIngreso = ?, nEgreso = ?
                WHERE idRma = ?`;
            const [result] = await connection.execute(query, [
                modelo, cantidad, marca, solicita, opLote, vencimiento,
                seEntrega, seRecibe, observaciones, nIngreso, nEgreso, idRma
            ]);

            if (result.affectedRows > 0) {
                res.status(200).json({ success: true, message: 'Producto actualizado correctamente.' });
            } else {
                res.status(404).json({ success: false, message: 'Producto no encontrado.' });
            }
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            res.status(500).json({ success: false, message: 'Error al actualizar producto.' });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },

    postEliminarProducto: async (req, res) => {
        const { idRma } = req.params;
        if (!idRma) {
            return res.status(400).json({ error: 'ID de producto no proporcionado' });
        }

        let connection;
        try {
            connection = await conn.getConnection();
            const query = 'DELETE FROM r_m_a WHERE idRma = ?';
            const [result] = await connection.execute(query, [idRma]);

            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Producto eliminado exitosamente' });
            } else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            res.status(500).json({ error: 'Error al eliminar el producto' });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },
};
