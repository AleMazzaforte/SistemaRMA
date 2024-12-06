const { conn } = require('../bd/bd');

module.exports = {
    getEstadisticasOp: async (req, res) => {
        let connection;

        try {
            connection = await conn.getConnection();

            // Obtener productos importados hasta 6 meses antes de la fecha actual
            const [productosImportados] = await connection.query(`
                SELECT 
                    producto AS nombre,
                    SUM(cantidad) AS total_importado
                FROM 
                    OP
                WHERE 
                    fechaIngreso < DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
                GROUP BY 
                    producto
            `);

            // Obtener productos devueltos (RMA) sin OP
            const [productosDevueltosSinOp] = await connection.query(`
                SELECT 
                    modelo AS nombre,
                    SUM(cantidad) AS total_devuelto_sin_op
                FROM 
                    r_m_a
                WHERE 
                    marca = 'BLOWINK'
                GROUP BY 
                    modelo
            `);

            // Obtener productos devueltos (RMA) con OP
            const [productosDevueltosConOp] = await connection.query(`
                SELECT 
                    nombre,
                    SUM(cantidad) AS total_devuelto_con_op
                FROM 
                    productosViejos
                GROUP BY 
                    nombre
            `);

            // Combinar resultados y calcular el porcentaje de productos fallados
            const estadisticas = productosImportados.map(importado => {
                const devueltoSinOp = productosDevueltosSinOp.find(dev => dev.nombre === importado.nombre) || { total_devuelto_sin_op: 0 };
                const devueltoConOp = productosDevueltosConOp.find(dev => dev.nombre === importado.nombre) || { total_devuelto_con_op: 0 };
                
                const totalDevuelto = parseInt((devueltoSinOp.total_devuelto_sin_op || 0) + (devueltoConOp.total_devuelto_con_op || 0));
                const porcentajeFallados = (totalDevuelto / importado.total_importado) * 100;

                return {
                    producto: importado.nombre,
                    total_importado: importado.total_importado,
                    total_devuelto: totalDevuelto,
                    porcentaje_fallados: porcentajeFallados.toFixed(2)
                };
            });

            res.render('estadisticas', { estadisticas });
        } catch (error) {
            console.error('Error al obtener estadísticas de OP:', error);
            res.status(500).send('Error al obtener estadísticas de OP');
        } finally {
            if (connection) connection.release();
        }
    }
};

