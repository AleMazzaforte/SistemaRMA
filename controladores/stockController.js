const { conn } = require('../bd/bd');

module.exports = {

    getStockEjs: (req, res) => {
        res.render('stock');
    },


    getStock: async (req, res) => {
        const query = `
            SELECT modelo, cantidad, marca
            FROM r_m_a
            ORDER BY modelo, marca;
        `;
        let connection;
        try {
            connection = await conn.getConnection();
            const [rows] = await connection.query(query);
            
            res.json(rows); // Enviar datos en formato JSON
        } catch (error) {
            console.error('Error al obtener el stock:', error);
            res.status(500).send('Error al obtener el stock');
        } finally {
            if (connection) connection.release();
        }
    }
};

