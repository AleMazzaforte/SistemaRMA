const conn = require('../bd/bd');

module.exports = {
    getConsultaCliente: (req, res) => {
        res.render('consultaCliente', { title: 'Consulta' });
    },

    getListarRma: async (req, res) => {

        const { idCliente } = req.query;

        try {
            const rmaData = await db.query(`SELECT modelo, cantidad, marca, solicita, opLote, vencimiento, seEntrega, seRecibe, observaciones, nIngreso, nEgreso FROM r_m_a WHERE idCliente = ?`, [idCliente]);

            if (rmaData.length > 0) {
                res.json(rmaData);
            } else {
                res.json({ message: 'No hay RMA para este cliente' });
            }
        } catch (error) {
            console.error('Error al obtener datos de RMA:', error);
            res.status(500).json({ error: 'Error al obtener datos de RMA' });
        }
    }
}




