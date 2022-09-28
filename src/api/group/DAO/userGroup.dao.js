import db from "../../../config/db.js";
import logger from "../../../config/logger.js";

export const userGroupDao = {
    selectAdminGroup(parameter){
        return new Promise((resolve,reject) => {
            const queryData = `SELECT ug.group_id, ug.group_name, ug.group_image, ug.intro FROM admin_group AS ag RIGHT JOIN univ_group AS ug ON ag.group_id = ug.group_id WHERE ag.user_id = ? AND ag.is_approved = ?;`;
            db.query(queryData, [parameter.user_id, 1], (error, db_data)=>{
                if (error) {
                    logger.error(
                        "DB error [user_group & univ_group]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve(db_data)
            })
        })
    },
    selectUserGroup(parameter){
        return new Promise((resolve,reject) => {
            const queryData = `SELECT b.group_id, b.group_name, b.group_image, b.intro FROM user_group AS a RIGHT JOIN univ_group AS b ON a.group_id = b.group_id WHERE a.user_id = ?`;
            db.query(queryData, [parameter.user_id], (error, db_data)=>{
                if (error) {
                    logger.error(
                        "DB error [user_group & univ_group]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve(db_data)
            })
        })
    },
    addGroup(parameter){
        return new Promise((resolve, reject) => {
            const queryData = `INSERT INTO user_group (user_id, group_id) VALUES (?,?)`;
            db.query(queryData, [parameter.user_id, parameter.group_id], (error, db_data)=>{
                if (error) {
                    logger.error(
                        "DB error [user_group]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve('구독에 성공하였습니다.')
            })
        })
    },
    duplicateGroup(parameter){
        return new Promise((resolve, reject) => {
            const queryData = `SELECT COUNT(*) AS count FROM user_group WHERE user_id = ? AND group_id = ?`;
            db.query(queryData, [parameter.user_id, parameter.group_id], (error, db_data)=>{
                if (error) {
                    logger.error(
                        "DB error [user_group]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                if(db_data[0].count === 1) reject('이미 구독중 입니다.')
                resolve(true)
            })
        })
    },
    deleteMyGroup(parameter){
        return new Promise((resolve, reject) => {
            const queryData = `DELETE FROM user_group WHERE user_id = ? AND group_id = ?`;
            db.query(queryData, [parameter.user_id, parameter.group_id], (error, db_data) => {
                if (error) {
                    logger.error(
                        "DB error [user_group]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve('구독 취소에 성공하였습니다.')
            })
        })
    }
}