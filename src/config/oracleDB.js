'use strict';

const oracledb = require('oracledb');
const logger = require('../config/logger')
const db = require('../config/db')

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
var config = {
    user: process.env.oracle_user,
    password: process.env.oracle_pass,
    connectString: process.env.oracle_connectionString
}
var conn;
console.log('접근중...');
oracledb.getConnection(config, async(err, con)=>{
    if(err){
        console.log('접속에 실패하였습니다...', err);
        return;
    }
    console.log('접속 성공');
    conn = con;
})

function authLoginOracle(parameters) {
    return new Promise(function (resolve, reject) {
        try {
            // const queryData = `SELECT ID, NM, M_PHONE, DEPT_NM, SCHYR, ADDR, GRAD_YN FROM SW_USER_1 WHERE ID='${parameters.user_id}' AND PASS='${parameters.pwd}'`;
            // const queryData =  `SELECT * FROM SW_USER_1 WHERE ROWNUM < 10`;
            const queryData =  `SELECT * FROM SW_USER_1 WHERE ID='${parameters.user_id}' AND PASS='${parameters.pwd}'`;
            conn.execute(queryData,function(err,db_data){
                if (err) {
                    logger.error(
                        "DB error [User]" +
                        "\n \t" + queryData +
                        "\n \t" + err
                    );
                    reject('DB ERR');
                }
                console.log(db_data.rows[0])
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
            const queryData =  `SELECT * FROM SW_USER_1 WHERE ID='${parameters.user_id}'`;
            conn.execute(queryData,function(err,db_data){
                if (err) {
                    logger.error(
                        "DB error [User]" +
                        "\n \t" + queryData +
                        "\n \t" + err
                    );
                    reject('DB ERR');
                }
                console.log(db_data.rows[0])
                if (db_data.rows[0] != undefined) resolve(db_data.rows[0]);
                // else reject("학번 혹은 비밀번호를 다시 확인하세요.")
                else resolve(false)
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
            const queryData = `SELECT USER_ID, NM, M_PHONE, DEPT_NM, SCHYR, ADDR, GRAD_YN FROM userAuth WHERE USER_ID='${parameters.user_id}' AND PASSWD='${parameters.pwd}'`;
            db.query(queryData, function (error, db_data) {
                if (error) {
                    logger.error(
                        "DB error [User]" +
                        "\n \t" + queryData +
                        "\n \t" + error
                    );
                    reject('DB ERR');
                }
                if (db_data[0] != undefined) resolve(db_data[0]);
                else reject("학번 혹은 비밀번호를 다시 확인하세요.")
            })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports ={
    authLogin,
    authLoginOracle,
    userCheck
}