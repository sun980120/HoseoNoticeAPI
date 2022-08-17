import db from '../../../config/db.js';
import logger from '../../../config/logger.js';

export const pushDao = {
    getMyPushLog(parameter) {
        return new Promise((resolve, reject)=>{
            const queryData = `SELECT pl.push_id, pl.push_title, pl.push_content, pl.push_date
                               FROM push_user AS pu
                                        RIGHT JOIN push_log AS pl ON pu.push_id = pl.push_id
                               WHERE pu.user_id = ?`;
            db.query(queryData, [parameter.user_id], (error, db_data)=>{
                if (error) {
                    logger.error(
                        "DB error [push_user & push_log]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve(db_data)
            })
        })
    },
    insertPushLog(parameter) {
        return new Promise((resolve, reject)=>{
            const queryData = `INSERT INTO push_log (group_id, push_title, push_content, push_date) VALUE (?,?,?,?)`;
            db.query(queryData, [parameter.group_id, parameter.title, parameter.content, parameter.create_time], (error, db_data)=>{
                if (error) {
                    logger.error(
                        "DB error [push_log]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve(db_data.insertId)
            })
        })
    },
    insertPushUser(user_id, push_id) {
        return new Promise((resolve, reject)=>{
            const queryData = `INSERT INTO push_user (user_id, push_id) VALUE (?,?)`;
            db.query(queryData, [user_id, push_id], (error, db_data)=>{
                if (error) {
                    logger.error(
                        "DB error [push_user]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve(true)
            })
        })
    },
    pushMessageDT(group_id){
        return new Promise((resolve, reject)=>{
            const queryData = `SELECT u.device_token, ug.user_id
            FROM user AS u 
            RIGHT JOIN user_group AS ug ON u.user_id = ug.user_id
            WHERE ug.group_id = ? AND u.push_active = '동의'`;
            db.query(queryData, [group_id], (error, db_data)=>{
                if (error) {
                    logger.error(
                        "DB error [user & user_group]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve(db_data)
            })
        })
    }
}