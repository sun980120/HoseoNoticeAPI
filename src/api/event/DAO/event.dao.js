'use strict';

import db from '../../../config/db.js'
import logger from '../../../config/logger.js'

function eventMain() {
    return new Promise(function (resolve, reject) {
        var queryData = `SELECT event_id, title, url, start_date, end_date, limits FROM event
        WHERE start_date <= now() AND now() <= end_date`;
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [event]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            else if(db_data == ""){
                logger.error(
                    "DB error [Not event]" +
                    "\n \t" + db_data
                );
                reject('날짜에 해당하는 이벤트가 없습니다.');
            }
            else{
                console.log(db_data);
                resolve(db_data);
            }
        })
    })
}

function eventAll() {
    return new Promise(function (resolve, reject) {
        var queryData = `SELECT * FROM event ORDER BY start_date DESC`;
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [event]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve(db_data);
        })
    })
}

/* 이벤트 상세 페이지
function eventDetail(parameters) {
    return new Promise(function(resolve, reject) {
        var queryData = `SELECT * FROM event WHERE event_id = ? AND title = ?`;
        db.query(queryData, [parameters.event_id, parameters.title], function(error, db_data){
            if(error){
                logger.error(
                    "DB error [event]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve(db_data);
        })
    })
}
*/

function eventWrite(parameters) {
    return new Promise(function (resolve, reject) {
        let queryData = `INSERT INTO event (title, url, start_date, end_date, limits, is_enrolled, is_checked)
        SELECT '${parameters.title}','${parameters.url}', '${parameters.start_date}', '${parameters.end_date}', ${parameters.limits}, ${parameters.is_enrolled}, ${parameters.is_checked}
        FROM dual WHERE NOT EXISTS (SELECT * FROM event WHERE title = '${parameters.title}' OR start_date = '${parameters.start_date}' OR end_date = '${parameters.end_date}')`;
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [event]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            console.log(db_data);
            if(db_data.affectedRows === 0){
                reject('존재하는 이벤트입니다.');
            }
            resolve('이벤트 추가를 완료했습니다.');
        })
    })
}

function eventUpdate(parameters) {
    return new Promise(function (resolve, reject) {
        var queryData = `UPDATE event SET title = '${parameters.title}',url = '${parameters.url}', start_date = '${parameters.start_date}', end_date = '${parameters.end_date}', limits = ${parameters.limits}, is_enrolled = ${parameters.is_enrolled}, is_checked = ${parameters.is_checked}
        WHERE event_id = ${parameters.event_id}`;
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB errer [event] " +
                    "\n \t" + queryData +
                    "\n \t" + error
                );
                reject('DB ERR');
            }
            if(db_data.affectedRows == 1) resolve('이벤트 수정을 완료했습니다.');
            reject('존재하지 않는 이벤트입니다.');
        })
    })
}

function eventEnrolled(parameters) {
    return new Promise(function(resolve, reject){
        var queryData = `UPDATE event SET is_enrolled = ${parameters.is_enrolled}
        WHERE event_id = ${parameters.event_id}`;
        db.query(queryData, function(error, db_data) {
            if(error){
                logger.error(
                    "DB errer [event] " +
                    "\n \t" + queryData +
                    "\n \t" + error
                );
                reject('DB ERR');
            }
            if(db_data.affectedRows === 0) reject('존재하지 않는 이벤트입니다.');
            resolve('이벤트 수정을 완료했습니다.');
        })
    })
}

function eventChecked(parameters){
    return new Promise(function(resolve, reject){
        var queryData = `UPDATE event SET is_checked = '${parameters.is_checked}'
        WHERE event_id = ${parameters.event_id}`;
        db.query(queryData, function(error, db_data){
            if(error){
                logger.error(
                    "DB errer [event] " +
                    "\n \t" + queryData +
                    "\n \t" + error
                );
                reject('DB ERR');
            }
            if(db_data.affectedRows == 1)   resolve('이벤트 수정을 완료했습니다.');
            reject('존재하지 않는 이벤트입니다.');
        })
    })
}

function eventDelete(parameters) {
    return new Promise(function (resolve, reject) {
        var queryData = `DELETE FROM event WHERE event_id = ?`;
        db.query(queryData, [parameters.event_id], function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [event]" +
                    "\n \t" + queryData +
                    "\n \t" + error
                );
                reject('DB ERR');
            }
            if(db_data.affectedRows == 1) resolve('이벤트 삭제를 완료했습니다.');
            reject('존재하지 않는 이벤트입니다.');
        })
    })
}

export const eventDAO = {
    eventAll,
    eventMain,
    eventDelete,
    eventWrite,
    eventUpdate,
    // eventDetail,
    eventEnrolled,
    eventChecked
}