const { conn } = require('../bd/bd');

let productos = [
    {
      "MODELO": "111L",
      "CANTIDAD": 2,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "133 N",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "197 N",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "73 M",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "73 A",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "133 C",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "111S",
      "CANTIDAD": 2,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "297 N",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "196 C",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "111S",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "GI190 N",
      "CANTIDAD": 2,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "46 N",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "206 N",
      "CANTIDAD": 3,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "664 N",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "662 N",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "664 C",
      "CANTIDAD": 2,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "111L",
      "CANTIDAD": 2,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "111L",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "111L",
      "CANTIDAD": 8,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "206 M",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "206 C",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "85A",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "111S",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "28 XL",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "206 N",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": 1060,
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": 117,
      "CANTIDAD": 2,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "664 N",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "105A s/c",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "206 N",
      "CANTIDAD": 4,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "85A",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": 111,
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "664 N",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "73 N",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "206 C",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "206 N",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "133 N",
      "CANTIDAD": 2,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": 1060,
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "206 N",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "664 N",
      "CANTIDAD": 2,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": 1060,
      "CANTIDAD": 2,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "111L",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "111S",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "105A",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "63 M",
      "CANTIDAD": 2,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": 1060,
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "296 M",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "133 A",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "206 N",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": 117,
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "297 N",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "206 N",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "197 N",
      "CANTIDAD": 2,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "197 N",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    },
    {
      "MODELO": "196 C",
      "CANTIDAD": 1,
      "MARCA": "BLOW INK"
    }
  ]
  
  



module.exports = {
    getCargarOp: (req, res) => {
        res.render('cargarOp')
    },

    getActualizarOp: (req, res) => {
        res.render('actualizarOp')
    },

    postCargarOp: async (req, res) => { 
        const { op, fechaIngreso, productos } = req.body; 
        const query = `INSERT INTO OP (op, producto, cantidad, fechaIngreso) VALUES (?, ?, ?, ?)`; 
        let connection; 
        try { 
            connection = await conn.getConnection(); 
            for (const producto of productos) { 
                await connection.query(query, [op, producto.producto, producto.cantidad, fechaIngreso]); 
            } res.send('OP cargada exitosamente'); 
        } catch (error) { 
            console.error('Error al cargar OP:', error); 
            res.status(500).send('Error al cargar OP'); 
        } finally { 
            if (connection) connection.release(); 
        } 
    },

    // Nueva función para listar OPs únicas 
    getListarOps: async (req, res) => { 
        const query = 'SELECT DISTINCT op FROM OP'; 
        let connection; 
        try { 
            connection = await conn.getConnection(); 
            const [results] = await connection.query(query); 
            res.json(results); 
        } catch (error) { 
            console.error('Error al listar OPs:', error); 
            res.status(500).send('Error al listar OPs'); 
        } finally { if (connection) connection.release(); 

        } 
    }, 
    
    // Nueva función para obtener los detalles de una OP
     getDetalleOp: async (req, res) => { 
        const { opId } = req.params; const query = 'SELECT producto, cantidad FROM OP WHERE op = ?'; 
        let connection; try { 
            connection = await conn.getConnection(); 
            const [results] = await connection.query(query, [opId]); 
            res.json(results); 
        } catch (error) { console.error('Error al obtener detalles de la OP:', error); 
            res.status(500).send('Error al obtener detalles de la OP'); 
        } finally { 
            if (connection) connection.release();
        }
    },

    postActualizarOp: async (req, res) => { 
        const { op, productos } = req.body; // Convertir productos en un array de objetos 
        const productosParsed = JSON.parse(productos); 
        const updateQueries = productosParsed.map(producto => ({ 
            query: 'UPDATE OP SET producto = ?, cantidad = ? WHERE op = ? AND producto = ?', values: [producto.nuevoProducto, producto.cantidad, op, producto.producto] 
        })); 
        let connection; 
        try { 
            connection = await conn.getConnection(); 
            for (const { query, values } of updateQueries) { 
                await connection.query(query, values); 
            } res.send('OP actualizada exitosamente'); 
        } catch (error) { 
            console.error('Error al actualizar OP:', error); 
            res.status(500).send('Error al actualizar OP'); 
        } finally { 
            if (connection) connection.release();
        }
    },

    //ruta temporal
    getCargarDatosViejos: (req, res) => {
        res.render('cargarProductosViejos')
    },

    guardarProductos: async (req, res) => { 
        const query = `INSERT INTO productosViejos (nombre, cantidad) VALUES (?, ?)`; 
        let connection; 
        try { 
            connection = await conn.getConnection(); 
            for (const producto of productos) { 
                await connection.query(query, [producto.MODELO, producto.CANTIDAD]); 
            } res.send('Productos guardados exitosamente'); 
        } catch (error) { 
            console.error('Error al guardar productos:', error); 
            res.status(500).send('Error al guardar productos'); 
        } finally { 
            if (connection) connection.release();
        }
    }
}