const { conn } = require('../bd/bd');
const ExcelJS = require('exceljs');

module.exports = {
    getEstadisticasOp: async (req, res) => {
        let connection;

        try {
            connection = await conn.getConnection();

            // Obtener OP que empiezan con LS y que tienen menos de 6 meses 
            const [opLs] = await connection.query(` 
                SELECT 
                    producto AS nombre, 
                    SUM(cantidad) AS total_importado 
                FROM 
                    OP 
                WHERE 
                    op LIKE 'LS%' AND fechaIngreso < DATE_SUB(CURDATE(), INTERVAL 6 MONTH) 
                GROUP BY 
                    producto 
            `); 
            
            // Obtener OP que empiezan con TJ y que tienen menos de 6 meses 
            const [opTj] = await connection.query(` 
                SELECT 
                    producto AS nombre, 
                    SUM(cantidad) AS total_importado 
                FROM 
                    OP 
                WHERE 
                    op LIKE 'TJ%' AND fechaIngreso < DATE_SUB(CURDATE(), INTERVAL 6 MONTH) 
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
                    marca = 'BLOW INK'
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

            // Combinar resultados y calcular el porcentaje de productos fallados para OP que empiezan con LS
            const estadisticasLs = opLs.map(importado => {
                const devueltoSinOp = productosDevueltosSinOp.find(dev => dev.nombre === importado.nombre) || { total_devuelto_sin_op: 0 };
                const devueltoConOp = productosDevueltosConOp.find(dev => dev.nombre === importado.nombre) || { total_devuelto_con_op: 0 };
                
                const totalDevuelto = Number(devueltoSinOp.total_devuelto_sin_op || 0) + Number(devueltoConOp.total_devuelto_con_op || 0);
                const porcentajeFallados = (totalDevuelto / importado.total_importado) * 100;

                return {
                    producto: importado.nombre,
                    total_importado: importado.total_importado,
                    total_devuelto: totalDevuelto,
                    porcentaje_fallados: porcentajeFallados.toFixed(2)
                };
            });

            

            // Combinar resultados y calcular el porcentaje de productos fallados para OP que empiezan con TJ
            const estadisticasTj = opTj.map(importado => {
                const devueltoSinOp = productosDevueltosSinOp.find(dev => dev.nombre === importado.nombre) || { total_devuelto_sin_op: 0 };
                const devueltoConOp = productosDevueltosConOp.find(dev => dev.nombre === importado.nombre) || { total_devuelto_con_op: 0 };
                
                const totalDevuelto = Number(devueltoSinOp.total_devuelto_sin_op || 0) + Number(devueltoConOp.total_devuelto_con_op || 0);
                const porcentajeFallados = (totalDevuelto / importado.total_importado) * 100;

                return {
                    producto: importado.nombre,
                    total_importado: importado.total_importado,
                    total_devuelto: totalDevuelto,
                    porcentaje_fallados: porcentajeFallados.toFixed(2)
                };
            });

            res.render('estadisticas', { estadisticasLs, estadisticasTj });
        } catch (error) {
            console.error('Error al obtener estadísticas de OP:', error);
            res.status(500).send('Error al obtener estadísticas de OP');
        } finally {
            if (connection) connection.release();
        }
    },

    // Controlador para descargar Excel de LS 
    getDescargarExcelLs: async (req, res) => { 
        const workbook = new ExcelJS.Workbook(); 
        const worksheet = workbook.addWorksheet('Estadísticas LS'); 
        worksheet.columns = [ 
            { header: 'Producto', key: 'producto', width: 30 }, 
            { header: 'Total Importado', key: 'total_importado', width: 20, style: { numFmt: '#,##0', alignment: { horizontal: 'center' } } }, 
            { header: 'Total Devuelto', key: 'total_devuelto', width: 20, style: { alignment: { horizontal: 'center' } } }, 
            { header: 'Porcentaje Fallados', key: 'porcentaje_fallados', width: 20, style: { alignment: { horizontal: 'center' } } } 
        ]; 
        let connection; 
        try { 
            connection = await conn.getConnection(); 
            const [opLs] = await connection.query(` 
                SELECT producto AS nombre, 
                    SUM(cantidad) AS total_importado 
                FROM 
                    OP 
                WHERE 
                    op 
                LIKE 'LS%' AND fechaIngreso < DATE_SUB(CURDATE(), INTERVAL 6 MONTH) 
                GROUP BY 
                    producto 
            `); 
            const [productosDevueltosSinOp] = await connection.query(` 
                SELECT 
                    modelo AS nombre, 
                    SUM(cantidad) AS total_devuelto_sin_op 
                FROM 
                    r_m_a 
                WHERE 
                    marca = 'BLOW INK' 
                GROUP BY 
                    modelo 
            `); 
            const [productosDevueltosConOp] = await connection.query(` 
                SELECT 
                    nombre, 
                    SUM(cantidad) AS total_devuelto_con_op 
                FROM 
                    productosViejos 
                GROUP BY 
                    nombre 
                `); 
                
                const estadisticasLs = opLs.map(importado => { 
                    const devueltoSinOp = productosDevueltosSinOp.find(dev => dev.nombre === importado.nombre) || { total_devuelto_sin_op: 0 }; 
                    const devueltoConOp = productosDevueltosConOp.find(dev => dev.nombre === importado.nombre) || { total_devuelto_con_op: 0 }; 
                    
                    const totalDevuelto = Number(devueltoSinOp.total_devuelto_sin_op || 0) + Number(devueltoConOp.total_devuelto_con_op || 0); 
                    const porcentajeFallados = (totalDevuelto / importado.total_importado) * 100;

                    return { 
                        producto: importado.nombre, 
                        total_importado: Number(importado.total_importado), 
                        total_devuelto: totalDevuelto, 
                        porcentaje_fallados: porcentajeFallados.toFixed(2) 
                    }; 
                }); 
                
                estadisticasLs.forEach(estadistica => {
                    worksheet.addRow(estadistica); 
                }); 
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); 
                res.setHeader('Content-Disposition', 'attachment; filename=estadisticas_ls.xlsx'); 
                workbook.xlsx.write(res) 
                    .then(() => { 
                        res.end(); 
                    }); 
                } catch (error) { 
                    console.error('Error al generar el archivo Excel:', error); 
                    res.status(500).send('Error al generar el archivo Excel');
                } finally { 
                    if (connection) connection.release(); 
                }
    },

     // Controlador para descargar Excel de TJ 
    getDescargarExcelTj: async (req, res) => { 
        const workbook = new ExcelJS.Workbook(); 
        const worksheet = workbook.addWorksheet('Estadísticas TJ'); 
        worksheet.columns = [ 
            { header: 'Producto', key: 'producto', width: 30 }, 
            { header: 'Total Importado', key: 'total_importado', width: 20, style: { numFmt: '#,##0', alignment: { horizontal: 'center' } } }, 
            { header: 'Total Devuelto', key: 'total_devuelto', width: 20, style: { alignment: { horizontal: 'center' } } }, 
            { header: 'Porcentaje Fallados', key: 'porcentaje_fallados', width: 20, style: { alignment: { horizontal: 'center' } } } 
        ]; 
        let connection;
            try { 
            connection = await conn.getConnection(); 
            const [opTj] = await connection.query(` SELECT producto AS nombre, SUM(cantidad) AS total_importado FROM OP WHERE op LIKE 'TJ%' AND fechaIngreso < DATE_SUB(CURDATE(), INTERVAL 6 MONTH) GROUP BY producto `); const [productosDevueltosSinOp] = await connection.query(` SELECT modelo AS nombre, SUM(cantidad) AS total_devuelto_sin_op FROM r_m_a WHERE marca = 'BLOW INK' GROUP BY modelo `); 
            const [productosDevueltosConOp] = await connection.query(` SELECT nombre, SUM(cantidad) AS total_devuelto_con_op FROM productosViejos GROUP BY nombre `); 
            const estadisticasTj = opTj.map(importado => { 
                const devueltoSinOp = productosDevueltosSinOp.find(dev => dev.nombre === importado.nombre) || { total_devuelto_sin_op: 0 }; const devueltoConOp = productosDevueltosConOp.find(dev => dev.nombre === importado.nombre) || { total_devuelto_con_op: 0 }; 
                const totalDevuelto = Number(devueltoSinOp.total_devuelto_sin_op || 0) + Number(devueltoConOp.total_devuelto_con_op || 0); 
                const porcentajeFallados = (totalDevuelto / importado.total_importado) * 100; 
                return { 
                    producto: importado.nombre, 
                    total_importado: Number(importado.total_importado), 
                    total_devuelto: totalDevuelto, 
                    porcentaje_fallados: porcentajeFallados.toFixed(2) 
                }; 
            }); 
            estadisticasTj.forEach(estadistica => { 
                worksheet.addRow(estadistica); 
            }); 
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); 
            res.setHeader('Content-Disposition', 'attachment; filename=estadisticas_tj.xlsx'); 
            workbook.xlsx.write(res) 
            .then(() => { 
                res.end(); 
            }); 
        } catch (error) { 
            console.error('Error al generar el archivo Excel:', error);
            res.status(500).send('Error al generar el archivo Excel'); 
        } finally { 
            if (connection) connection.release(); 
        } 
    }
};


