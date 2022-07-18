'use strict';

import db from '../../../config/db.js'
import logger from '../../../config/logger.js'

function checkApplyDepartment(parameters){
    return new Promise(function (resolve, reject){
        let queryData = `SELECT apply_department FROM applyDepartment_program WHERE program_id=?`;
        db.query(queryData, [parameters.program_id], function(error, db_data){
            let dataList = [];
            if (error) {
                logger.error(
                    "DB error [applyDepartment_program]"+
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                // throw error;
            }
            for(let data of db_data){
                dataList.push(data.apply_department)
            }
            resolve(dataList)
        })
    })
}

function insertApplyDepartment(program_id, data){
    return new Promise(function (resolve, reject){
        let queryData = `INSERT INTO applyDepartment_program (program_id, apply_department) VALUES (?, ?)`
        db.query(queryData,[program_id, data], function(error, db_data){
            if (error) {
                logger.error(
                    "DB error [applyDepartment_program]"+
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                // throw error;
            }
            resolve('신청 가능 학과 데이터 입력 완료')
        })
    })
}

export const applyDepartmentDAO = {
    checkApplyDepartment,
    insertApplyDepartment
}