const { conn } = require('../bd/bd');

module.exports = {

    getCargarRma: async (req, res) => {
        res.render('rma');
    },

    getListarClientesRma: async (req, res) => {
        let connection;
        try {
            connection = await conn.getConnection();
            const [clientes] = await connection.query('SELECT id, nombre FROM clientes');
            res.json(clientes);  // Retorna los clientes en formato JSON
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al listar los clientes' });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },

    postAgregarRma: async (req, res) => {
        // Desestructuración de los campos del cuerpo de la solicitud
        let { modelo, cantidad, marca, solicita, opLote, vencimiento, seEntrega, seRecibe, observaciones, nIngreso, nEgreso, idCliente } = req.body;

        // Si los campos opcionales están vacíos, asignarlos como null
        opLote = opLote || null;
        vencimiento = vencimiento || null;
        seEntrega = seEntrega || null;
        seRecibe = seRecibe || null;
        observaciones = observaciones || null;
        nIngreso = nIngreso || null;
        nEgreso = nEgreso || null;

        let connection;
        try {
            connection = await conn.getConnection();
            // Inserción en la base de datos con valores null para los campos opcionales vacíos
            await connection.query(
                'INSERT INTO r_m_a (modelo, cantidad, marca, solicita, opLote, vencimiento, seEntrega, seRecibe, observaciones, nIngreso, nEgreso, idCliente) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [modelo, cantidad, marca, solicita, opLote, vencimiento, seEntrega, seRecibe, observaciones, nIngreso, nEgreso, idCliente]
            );
            res.redirect('/agregarRma');
        } catch (error) {
            console.error('Error al agregar RMA:', error);
            res.status(500).json({ message: 'Error al agregar RMA' });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }
};
