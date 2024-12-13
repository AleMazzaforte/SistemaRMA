const { conn } = require('../bd/bd');
const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');

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
                
                // Consulta para obtener los r_m_a asociados al cliente 
                const [rmas] = await connection.query('SELECT * FROM r_m_a WHERE idCliente = ?', [cliente.id]); 
                // Cambié el campo a idCliente para mayor claridad 
               console.log('rmas', [rmas])
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
    },

    imprimirEtiquetas: (req, res) => {
        const { cliente, remitente, cantidadBultos } = req.body;

        // Generar el contenido HTML para el PDF
        let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { 
                    font-family: Arial, sans-serif; margin: 10px; 
                } 
                .etiqueta:not(:last-child) { 
                    page-break-after: always; 
                }
                .etiqueta div {
                    margin-bottom: 9px; 
                } 
                .etiqueta .cliente-nombre, 
                .etiqueta .bultos { 
                    font-size: 1.5rem; 
                    text-align: center;
                } 
                .etiqueta .detalle { 
                    font-size: 1.3rem; 
                }
            </style>
        </head>
        <body>
        `;

        for (let i = 1; i <= cantidadBultos; i++) {
            htmlContent += `
            <div class="etiqueta"> 
                <div class="cliente-nombre"><strong>${cliente.nombre}</strong></div> <Br>
                <div class="detalle">CUIT: <strong>${cliente.cuit}</strong></div> 
                <div class="detalle">Provincia: <strong>${cliente.provincia}</strong></div> 
                <div class="detalle">Ciudad: <strong>${cliente.ciudad}</strong></div> 
                <div class="detalle">Dirección: <strong>${cliente.direccion}</strong></div> 
                <div class="detalle">Teléfono: <strong>${cliente.telefono}</strong></div> 
                <div class="detalle">Seguro: <strong>${cliente.seguro}</strong></div> 
                <div class="detalle">Entrega: <strong>${cliente.condicionDeEntrega}</strong></div> 
                <div class="detalle">Pago: <strong>${cliente.condicionDePago}</strong></div> <Br>
                <div class="detalle">Remitente: <strong>${remitente.nombre}</strong></div> 
                <div class="detalle">CUIT: <strong>${remitente.cuit}</strong></div>
                <div class="detalle">Dirección: <strong>${remitente.direccion}</strong></div> 
                <div class="detalle">Teléfono: <strong>${remitente.telefono}</strong></div> 
                <div class="bultos"><strong>BULTOS ${i} de ${cantidadBultos}</strong></div> 
            </div> `;
        }

        htmlContent += `
        </body>
        </html>
        `;

        // Opciones de configuración para el PDF
        const options = {
            width: '10cm',
            height: '19cm',
            border: {
                top: '3.5cm',
                right: '10px',
                bottom: '0px',
                left: '10px'
            }
        };

        // Crear y enviar el PDF como buffer y luego convertirlo a base64
        pdf.create(htmlContent, options).toBuffer((err, buffer) => {
            if (err) {
                console.error('Error al crear el PDF:', err);
                res.status(500).send('Error al crear el PDF');
            } else {
                const base64 = buffer.toString('base64');
                res.send({ base64 });
            }
        });
    }
};





