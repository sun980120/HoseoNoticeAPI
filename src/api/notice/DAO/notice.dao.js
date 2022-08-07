import db from "../../../config/db.js";
import logger from "../../../config/logger.js";

export const noticeDao = {
    allGroupNotice(parameter){
        return new Promise((resolve, reject)=>{
            const queryData = `SELECT * FROM notice WHERE group_id = ?`;
            db.query(queryData, [parameter.group_id], (error, db_data)=>{
                if (error) {
                    logger.error(
                        "DB error [notice]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve(db_data)
            })
        })
    },
    // downloadCount(parameter){
    //     return new Promise((resolve, reject)=>{
    //         const queryData = `SELECT`
    //     })
    // },
    detailNotice(parameter){
        return new Promise((resolve, reject)=>{
            const queryData = `SELECT n.title, n.content,n.create_time, nf.file_name FROM notice AS n RIGHT JOIN notice_file AS nf ON n.notice_id = nf.notice_id WHERE n.group_id = ? AND n.notice_id = ?`;
            db.query(queryData, [parameter.group_id, parameter.notice_id], (error, db_data)=>{
                if (error) {
                    logger.error(
                        "DB error [notice & notice_file]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve(db_data[0])
            })
        })
    }
}