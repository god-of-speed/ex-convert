const mysql = require('mysql');
const config = require('./app');

const pool = mysql.createPool({
    host: config.dbhost,
    port: config.dbport,
    user: config.dbusername,
    password: config.dbpassword,
    database: config.dbname
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {
            console.log('Database connection was closed');
        }
        if (err.code == 'ER_CON_COUNT_ERROR') {
            console.log('Database has too many connections');
        }
        if (err.code == 'ECONNREFUSED') {
            console.log('Database connection was refused');
        }
        return;
    }
    if (connection) {
        console.log('Connected');
        connection.release();
        return;
    }
});
module.exports = pool;