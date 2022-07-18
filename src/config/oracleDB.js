'use strict';

// const oracledb = require('oracledb');
import logger from './logger.js'
import db from './db.js'
import mysql from "mysql";

// oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const conn = mysql.createPool({
    host: process.env.ORACLE_DB_host,
    port: process.env.ORACLE_DB_port,
    user: process.env.ORACLE_DB_user,
    password: process.env.ORACLE_DB_password,
    database: process.env.ORACLE_DB_name,
    dateStrings: true
})
handleDisconnect(conn)

function handleDisconnect(client) {
    client.on('error', function (error) {
        if (!error.fatal) return;
        if (error.code !== 'PROTOCOL_CONNECTION_LOST') throw err;
        console.error('> Re-connecting lost MySQL connection: ' + error.stack);
        let connDB = mysql.createConnection(client.config);
        handleDisconnect(connDB);
        connDB.connect();
    });
};

function authLoginOracle(parameters) {
    return new Promise(function (resolve, reject) {
        try {
            // const queryData = `SELECT ID, NM, M_PHONE, DEPT_NM, SCHYR, ADDR, GRAD_YN FROM SW_USER_1 WHERE ID='${parameters.user_id}' AND PASS='${parameters.pwd}'`;
            // const queryData =  `SELECT * FROM SW_USER_1 WHERE ROWNUM < 10`;
            const queryData = `SELECT *
                               FROM SW_USER_1
                               WHERE ID = '${parameters.user_id}'
                                 AND PASS = '${parameters.pwd}'`;
            conn.query(queryData, function (err, db_data) {
                if (err) {
                    logger.error(
                        "DB error [User]" +
                        "\n \t" + queryData +
                        "\n \t" + err
                    );
                    reject('DB ERR');
                }
                if (db_data.rows[0] != undefined) resolve(db_data.rows[0]);
                else reject("학번 혹은 비밀번호를 다시 확인하세요.")
            })
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

function userCheck(parameters) {
    return new Promise(function (resolve, reject) {
        try {
            // const queryData = `SELECT ID, NM, M_PHONE, DEPT_NM, SCHYR, ADDR, GRAD_YN FROM SW_USER_1 WHERE ID='${parameters.user_id}' AND PASS='${parameters.pwd}'`;
            // const queryData =  `SELECT * FROM SW_USER_1 WHERE ROWNUM < 10`;
            const queryData = 'SELECT * FROM SW_USER_1 WHERE USER_ID = ? AND PASSWD = ?';
            conn.query(queryData, [parameters.user_id, parameters.pwd], function (err, db_data) {
                if (err) {
                    logger.error(
                        "DB error [User]" +
                        "\n \t" + queryData +
                        "\n \t" + err
                    );
                    reject('DB ERR');
                }
                if (db_data[0] !== undefined) resolve(db_data[0]);
                else reject("학번 혹은 비밀번호를 다시 확인하세요.")
                // else resolve(false)
            })
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}


function authLogin(parameters) {
    return new Promise(function (resolve, reject) {
        try {
            const queryData = `SELECT USER_ID, NM, M_PHONE, DEPT_NM, SCHYR, ADDR, GRAD_YN FROM SW_USER_1 WHERE USER_ID = ? AND PASSWD = ?`;
            conn.query(queryData, [parameters.user_id, parameters.pwd], function (error, db_data) {
                if (error) {
                    logger.error(
                        "DB error [User]" +
                        "\n \t" + queryData +
                        "\n \t" + error
                    );
                    reject('DB ERR');
                }
                console.log(db_data)
                if (db_data[0] !== undefined) resolve(db_data[0]);
                else reject("학번 혹은 비밀번호를 다시 확인하세요.")
            })
        } catch (error) {
            reject(error)
        }
    })
}

export const oracleDAO = {
    authLogin,
    authLoginOracle,
    userCheck
}