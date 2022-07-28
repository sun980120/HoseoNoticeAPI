'use strict';

import db from '../../../config/db.js'
import logger from '../../../config/logger.js'

function user_agreementInsert(parameters){
    return new Promise(function (resolve, reject){
        // let queryData = `INSERT INTO user_agreement (user_id, agreement_id, checked_date)
        // VALUES ('${parameters.user_id}', '${parameters.agreement_id}', '${parameters.checked_date}') ON DUPLICATE KEY
        // UPDATE user_id='${parameters.user_id}', agreement_id='${parameters.agreement_id}', checked_date='${parameters.checked_date}'`;

        let queryData = `INSERT INTO user_agreement (user_id, agreement_id, checked_date)
        VALUES('${parameters.user_id}', '${parameters.agreement_id}', '${parameters.checked_date}') ON DUPLICATE KEY 
        UPDATE user_id='${parameters.user_id}', agreement_id='${parameters.agreement_id}',
                checked_date='${parameters.checked_date}';`
        db.query(queryData, function (error, db_data){
            if(error) {
                logger.error(
                    "DB error [user_agreement]"+
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve('데이터 입력 완료')
        })
    })
}
function agreementInsert(parameters){
    return new Promise(function (resolve, reject){
        // let queryData = `INSERT INTO agreement (agreement_id, date, content) VALUES ('${parameters.agreement_id}','${parameters.date}','${parameters.content}')`;
        let queryData = `INSERT INTO agreement (agreement_id , date , content) SELECT "${parameters.agreement_id}", "${parameters.date}", "${parameters.content}" FROM dual WHERE NOT EXISTS (SELECT * FROM agreement WHERE agreement_id = "${parameters.agreement_id}");`
        db.query(queryData,function(error, db_data){
            if(error) {
                logger.error(
                    "DB error [agreement]"+
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            if(db_data.affectedRows == 1) resolve('데이터 입력 완료')
            reject('이미 존재하는 버전입니다.')
        })
    })
}
function agreementRead(){
    return new Promise(function (resolve, reject){
        let queryData = `SELECT agreement_id,content FROM agreement ORDER BY date desc LIMIT 1`;
        db.query(queryData, function(error, db_data){
            if(error) {
                logger.error(
                    "DB error [agreement]"+
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve(db_data)
        })
    })
}
function userAgreementCheck(parameters){
    console.log(parameters)
    return new Promise(function (resolve, reject){
        let queryData = `SELECT * FROM user_agreement WHERE user_id = ? and agreement_id = ?`;
        db.query(queryData, [parameters.user_id, parameters.agreement_id], function (error,db_data){
            if(error) {
                logger.error(
                    "DB error [user_agreement]"+
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            console.log(db_data)
            if(db_data[0] === undefined) resolve('동의가능')
            else reject('이미 동의하였습니다.')
        })
    })
}

export const agreementDAO = {
    user_agreementInsert,
    agreementInsert,
    agreementRead,
    userAgreementCheck,
}