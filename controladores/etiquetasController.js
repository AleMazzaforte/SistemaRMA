const {conn}  = require('../bd/bd');



module.exports = {
    getImprimirEtiqueta: (req, res) => {
        res.render('imprimirEtiqueta');
    },

    verificarRMAyBuscarCliente: async (req, res) => { 
        const { nombre } = req.body; 
        let connection; 
        try { 
            connection = await conn.getConnection(); 
            const [clientes] = await connection.query('SELECT * FROM clientes WHERE nombre LIKE ?', [`%${nombre}%`]); 
            if (clientes.length > 0) { 
                const cliente = clientes[0]; 
                const [rmas] = await connection.query('SELECT * FROM r_m_a WHERE cliente_id = ?', [cliente.id]); 
                const tieneRMA = rmas.some(rma => !rma.nEgreso); 
                if (tieneRMA) { 
                    res.json({ alerta: `El cliente ${cliente.nombre} tiene RMA`, cliente }); 
                } else { 
                    res.json({ cliente }); 
                } 
            } else { 
                res.status(404).json({ mensaje: 'Cliente no encontrado' }); 
            } 
        } catch (error) { 
            console.error('Error al buscar cliente:', error); 
            res.status(500).json({ error: 'Error al buscar cliente' }); 
        } finally { 
            if (connection) connection.release(); 
        } 
    }
}