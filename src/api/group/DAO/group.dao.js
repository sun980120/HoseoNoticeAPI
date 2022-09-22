import logger from '../../../config/logger.js';
import db from '../../../config/db.js';
import { error } from 'winston';

export const groupDao = {
    allGroup() {
        return new Promise((resolve, reject) => {
            const queryData = `SELECT group_id, group_name, intro, group_image
                               FROM univ_group`;
            db.query(queryData, (error, db_data) => {
                if (error) {
                    logger.error(
                        'DB error [univ_group]' +
                        '\n \t' + queryData +
                        '\n \t' + error);
                    reject('DB ERR');
                }
                resolve(db_data);
            });
        });
    },
    nameDuplicate(parameter) {
        return new Promise((resolve, reject) => {
            const queryData = `SELECT COUNT(*) AS count
                               FROM univ_group
                               WHERE group_name = ?`;
            db.query(queryData, [parameter.group_name], (error, db_data) => {
                if (error) {
                    logger.error('DB error [univ_group]' + '\n \t' + queryData + '\n \t' + error);
                    reject('DB ERR');
                }
                if (db_data[0].count === 1) reject('그룹 이름이 중복됩니다.');
                resolve(true);
            });
        });
    },
    createGroup(parameter) {
        return new Promise((resolve, reject) => {
            const queryData = `INSERT INTO univ_group (group_name, intro, group_image)
                               VALUES (?, ?, ?)`;
            db.query(queryData, [parameter.group_name, parameter.intro, parameter.group_image], (error, db_data) => {
                if (error) {
                    logger.error('DB error [univ_group]' + '\n \t' + queryData + '\n \t' + error);
                    reject('DB ERR');
                }
                resolve(db_data.insertId);
            });
        });
    },
    AdminGroupCheck(parameter) {
        return new Promise((resolve, reject) => {
            const queryData = `SELECT *
                               FROM admin_group
                               WHERE user_id = ?
                                 AND group_id = ? AND is_approved = 1`;
            db.query(queryData, [parameter.user_id, parameter.group_id], (error, db_data) => {
                if (error) {
                    logger.error('DB error [univ_group]' + '\n \t' + queryData + '\n \t' + error);
                    reject('DB ERR');
                }
                if (db_data[0] == undefined) reject('그룹에 권한이 없습니다.')
                resolve(true);
            });
        });
    },
    UserGroupCheck(parameter){
        return new Promise((resolve, reject)=>{
            const queryData = `SELECT * FROM user_group WHERE user_id = ? AND group_id = ?`;
            db.query(queryData, [parameter.user_id, parameter.group_id], (error, db_data)=>{
                if (error) {
                    logger.error('DB error [user_group]' + '\n \t' + queryData + '\n \t' + error);
                    reject('DB ERR');
                }
                if (db_data[0] == undefined) reject('그룹에 권한이 없습니다.')
                resolve(true)
            })
        })
    },
    adminGroupUser(group_id, user_id){
        return new Promise((resolve, reject)=>{
            const queryData = `INSERT INTO admin_group (user_id, group_id, is_approved) VALUE (?, ?, ?)`;
            db.query(queryData, [user_id, group_id, 1], (error, db_data)=>{
                console.log(db_data)
                if (error) {
                    logger.error('DB error [admin_group]' + '\n \t' + queryData + '\n \t' + error);
                    reject('DB ERR');
                }
                resolve('그룹이 생성되었습니다.')
            })
        })
    },
    adminGroupCall(parameter){
        return new Promise((resolve, reject) => {
            const queryData = `INSERT INTO admin_group (user_id, group_id) VALUE(?, ?)`;
            db.query(queryData, [parameter.user_id, parameter.group_id], (error, db_data)=>{
                if (error) {
                    logger.error('DB error [admin_group]' + '\n \t' + queryData + '\n \t' + error);
                    reject('DB ERR');
                }
                resolve('그룹에 신규 요청을 하였습니다.')
            })
        })
    },
    duplicateGroup(parameter){
        return new Promise((resolve, reject) => {
            const queryData = `SELECT COUNT(*) AS cnt FROM admin_group WHERE user_id = ? AND group_id = ?`;
            db.query(queryData, [parameter.user_id, parameter.group_id], (error, db_data) => {
                if (error) {
                    logger.error('DB error [admin_group]' + '\n \t' + queryData + '\n \t' + error);
                    reject('DB ERR');
                }
                if(db_data[0].cnt == 0) resolve(true)
                reject('이미 신청하였습니다.')
            })
        })
    }
};