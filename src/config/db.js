'use strict';

import mysql from "mysql";
// require('dotenv').config({ path : ".env" });

const db = mysql.createPool({
    host: process.env.DB_host,
    port: process.env.DB_port,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_database,
    dateStrings: true
})
handleDisconnect(db)

function handleDisconnect (client){
    client.on('error', function (error) {
        if(!error.fatal) return;
        if (error.code !== 'PROTOCOL_CONNECTION_LOST') throw err;
        console.error('> Re-connecting lost MySQL connection: ' + error.stack);
        let conn = mysql.createConnection(client.config);
        handleDisconnect(conn);
        conn.connect();
    });
};
export default db