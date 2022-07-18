'use strict';

import db from '../../../config/db.js'
import logger from '../../../config/logger.js'

function selectMileage(parameters) {
    return new Promise(function (resolve, reject) {
        let queryData = `SELECT program_id, REPLACE(SUBSTR(mileagedate,1,10) ,"-",".") AS mileage_date,
        case
                when 3 <= MONTH(mileagedate) <= 8
                then CONCAT(DATE_FORMAT(mileagedate, '%Y년도 '), '1학기')
                ELSE 
                        case
                                when 1 <= MONTH(mileagedate) <= 2
                                then CONCAT(DATE_FORMAT( DATE_ADD(mileagedate, INTERVAL -1 YEAR), '%Y년도 '), '2학기')
                                ELSE CONCAT(DATE_FORMAT(mileagedate, '%Y년도 '), '2학기')
                        END
        END AS date_time
        FROM mileage WHERE user_id = '${parameters.user_id}'
        order by mileagedate`;
        db.query(queryData, [parameters.user_id], function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [mileage]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve(db_data);
        })
    })
}

function insertMileage(parameters, user_id) {
    return new Promise(function (resolve, reject) {
        let queryData = `INSERT INTO mileage (program_id, user_id, mileage, mileagedate)
                        SELECT ${parameters.program_id}, '${user_id}', ${parameters.mileage}, '${parameters.mileage_date}' FROM DUAL
                        WHERE NOT EXISTS(SELECT program_id, user_id FROM mileage WHERE program_id = ${parameters.program_id} AND user_id = '${user_id}')`;
        db.query(queryData, function (error, db_data){
            if (error) {
                logger.error(
                    "DB error [mileage]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve('데이터 추가 완료');
        })
    })
}

function mymileageApp(parameters) {
    return new Promise(function (resolve, reject) {
        let queryData = `SELECT p.title, (p.mileage) AS program_mileage, REPLACE(SUBSTR(m.mileagedate,1,10) ,"-",".") AS mileage_date,
        case
                when 3 <= month(m.mileagedate) AND MONTH(m.mileagedate) <= 8
                then CONCAT(DATE_FORMAT(m.mileagedate, '%Y년도 '), '1학기')
                ELSE 
                        case
                                when 1 <= MONTH(m.mileagedate) AND MONTH(m.mileagedate) <= 2
                                then CONCAT(DATE_FORMAT( DATE_ADD(m.mileagedate, INTERVAL -1 YEAR), '%Y년도 '), '2학기')
                                ELSE CONCAT(DATE_FORMAT(m.mileagedate, '%Y년도 '), '2학기')
                        END
        END AS date_time
    FROM mileage m
    JOIN program p ON p.program_id = m.program_id
    WHERE m.user_id = '${parameters.user_id}'
    ORDER BY m.mileagedate;`;
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [program]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve(db_data);
        })
    })
}

function SemesterMileage(parameters){
    return new Promise(function(resolve, reject){
        let queryData = `SELECT
        SUM(case when 3 <= MONTH(NOW()) AND MONTH(NOW()) <= 8
                then case when  (YEAR(NOW()) = YEAR(m.mileagedate)) AND (3 <= MONTH(m.mileagedate) AND MONTH(m.mileagedate) <= 8)
                                then p.mileage
                        end
                when 9 <= MONTH(NOW()) AND MONTH(NOW()) <= 12
                then case when (YEAR(NOW()) = YEAR(m.mileagedate)) AND (9 <= MONTH(m.mileagedate) AND MONTH(m.mileagedate) <= 12)
                                then p.mileage
                        end
                when 1 <= MONTH(NOW()) AND MONTH(NOW()) <= 2
                then case when (YEAR(NOW()) = YEAR(m.mileagedate)) AND (1 <= MONTH(m.mileagedate) AND MONTH(m.mileagedate) <= 2)
                                then p.mileage
                             when (YEAR(NOW()) - 1 = YEAR(m.mileagedate)) AND (9 <= MONTH(m.mileagedate) AND MONTH(m.mileagedate) <= 12)
                                then p.mileage
                        end
                    
        END) AS semester
        FROM mileage m
        JOIN program p ON p.program_id = m.program_id
        JOIN user_program_answer upa ON upa.user_id = m.user_id AND upa.program_id = m.program_id
        WHERE upa.user_id = '${parameters.user_id}';`;
        db.query(queryData, function(error, db_data){
            if(error){
                logger.error(
                    "DB error [program]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR')
            }
            resolve(db_data)
        })
    })
}

export const mileageDAO = {
    selectMileage,
    insertMileage,
    mymileageApp,
    SemesterMileage
}