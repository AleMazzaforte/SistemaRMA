require('dotenv').config(); // Cargar el archivo .env

const mysql = require('mysql2');

const poolConnection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    queueLimit: 0
});

//  poolConnection.getConnection((err, connection) => {
//      if (err) {
//          console.error('Error connecting to the database:', err);
//          return;
//      }
//      console.log('Database connected successfully!');
//      connection.release(); // Liberar la conexión cuando se hace la prueba
//  });



module.exports = {
    conn: poolConnection.promise(),
    
}
