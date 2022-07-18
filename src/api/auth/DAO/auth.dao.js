'use strict';

import db from '../../../config/db.js'
import logger from '../../../config/logger.js'

function insertUser(parameters) {
    return new Promise(function (resolve, reject) {
        // const queryData = `INSERT INTO user (user_id, name, department, grade, phone, grad_yn , jwt_token, addr)
        // VALUES ('${parameters.user_id}','${parameters.name}','${parameters.department}',
        // '${parameters.SCHYR}','${parameters.phone}' ,'${parameters.GRAD_YN}','${parameters.jwt_token}', '${parameters.addr}') ON DUPLICATE KEY
        // UPDATE user_id='${parameters.user_id}', name='${parameters.name}', department='${parameters.department}',
        // grade='${parameters.SCHYR}', phone='${parameters.phone}', grad_yn='${parameters.GRAD_YN}, jwt_token='${parameters.jwt_token}'`;

        let queryData = `INSERT INTO user (user_id, name, department, grade, phone,grad_yn)
        VALUES('${parameters.user_id}', '${parameters.name}', '${parameters.department}','${parameters.SCHYR}'
        , '${parameters.phone}','${parameters.GRAD_YN}') ON DUPLICATE KEY 
        UPDATE user_id='${parameters.user_id}', name='${parameters.name}',
                department='${parameters.department}', grade='${parameters.SCHYR}', grad_yn='${parameters.GRAD_YN}',
                phone='${parameters.phone}';`
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [user]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve("유저 정보 저장 완료");
        })
    })
}
function insertJWT(parameters) {
    return new Promise(function (resolve, reject) {
        let queryData = `INSERT INTO user (user_id, name, department, grade, phone,jwt_token ,grad_yn)
        VALUES('${parameters.user_id}', '${parameters.name}', '${parameters.department}','${parameters.SCHYR}'
        , '${parameters.phone}','${parameters.jwt_token}','${parameters.GRAD_YN}') ON DUPLICATE KEY 
        UPDATE user_id='${parameters.user_id}', name='${parameters.name}',
                department='${parameters.department}', grade='${parameters.SCHYR}', phone='${parameters.phone}', jwt_token='${parameters.jwt_token}', 
                grad_yn='${parameters.GRAD_YN}';`

        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [user]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve("JWT 정보 저장 완료");
        })
    })
}
function checkUser(parameters) {
    return new Promise(function (resolve, reject){
        let queryData = `SELECT user_id, name, department, grade FROM user WHERE user_id='${parameters.user_id}'`
        db.query(queryData, function(error, db_data){
            if(error){
                logger.error(
                    "DB error [user]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve(db_data[0])
        })
    })
}

function checkAccept(parameters) {
    return new Promise(function (resolve, reject) {
        let queryData = `SELECT grad_yn, accept 
        FROM user
        WHERE user_id="${parameters.user_id}"`;
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [user] & [user_agreement]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            if(db_data[0].accept!="동의") resolve('미동의');
            if(db_data[0].grad_yn!="N") reject("죄송합니다. 재학생만 이용이 가능합니다.");
            resolve(db_data[0].accept)
        })
    })
}
function checkLevel(parameters){
    return new Promise(function (resolve, reject){
        let queryData = `SELECT level FROM user WHERE user_id='${parameters.user_id}'`
        db.query(queryData, function(error, db_data){
            if(error){
                logger.error(
                    "DB error [user]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve(db_data[0].level)
        })
    })
}
function updateAccept(parameters){
    return new Promise(function (resolve, reject){
        let queryData = `UPDATE user SET accept="동의" WHERE user_id="${parameters.user_id}"`;
        db.query(queryData,function(error,db_data){
            if(error){
                logger.error(
                    "DB error [user]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            if(db_data.affectedRows == 1) resolve('수정 완료');
            else reject("해당하는 인원이 존재하지 않습니다.")
        })
    })
}
function updateLEVEL(parameters){
    return new Promise(function (resolve, reject){
        let queryData = `UPDATE user SET level="9" WHERE user_id="${parameters.user_id}"`;
        db.query(queryData,function(error,db_data){
            if(error){
                logger.error(
                    "DB error [user]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            if(db_data.affectedRows == 1) resolve('수정 완료');
            else reject("해당하는 인원이 존재하지 않습니다.")
        })
    })
}
function updatePushDeviceToken(parameters){
    return new Promise(function (resolve, reject){
        let queryData = `UPDATE user SET push_active='동의', device_token='${parameters.device_token}' WHERE user_id='${parameters.user_id}'`;
        db.query(queryData, function(error, db_data){
            if(error){
                logger.error(
                    "DB error [user]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            if(db_data.affectedRows == 1) resolve('수정 완료');
            else reject("해당하는 인원이 존재하지 않습니다.")
        })
    })
}
function updateNotPushDeviceToken(parameters){
    return new Promise(function (resolve, reject){
        let queryData = `UPDATE user SET push_active='미동의', device_token='' WHERE user_id='${parameters.user_id}'`;
        db.query(queryData, function(error, db_data){
            if(error){
                logger.error(
                    "DB error [user]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            if(db_data.affectedRows == 1) resolve('수정 완료');
            else reject("해당하는 인원이 존재하지 않습니다.")
        })
    })
}
function agreementUpdate(parameters){
    return new Promise(function(resolve, reject){
        let queryData = `UPDATE user SET accept='미동의'`
        db.query(queryData, function(error, db_data){
            if(error){
                logger.error(
                    "DB error [user]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            if(db_data.affectedRows != 0) resolve('개인정보동의서 버전 업데이트 완료')
            else reject('해당하는 동의서가 없습니다.')
        })
    })
}
function selectDeviceToken(parameters){
    return new Promise(function (resolve, reject){
        let queryData = `SELECT device_token FROM user WHERE user_id = ?`;
        db.query(queryData, [parameters], function (error, db_data){
            if(error){
                logger.error(
                    "DB error [user]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            // console.log(db_data[0].device_token)
            return resolve(db_data[0].device_token)
        })
    })
}

export const authDAO = {
    insertUser,
    insertJWT,
    checkUser,
    checkAccept,
    checkLevel,
    agreementUpdate,
    updateAccept,
    updateLEVEL,
    updatePushDeviceToken,
    updateNotPushDeviceToken,
    selectDeviceToken,
}