import db from "../../../config/db.js";
import logger from "../../../config/logger.js";

export const noticeDao = {
    allGroupNotice(parameter){
        return new Promise((resolve, reject)=>{
            const queryData = `SELECT * FROM notice WHERE group_id = ? AND is_del = 'N'`;
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
    selectFile(notice_id){
      return new Promise((resolve, reject)=>{
          const queryData = `SELECT COUNT(*) AS cnt FROM notice_file WHERE notice_id = ?`;
          db.query(queryData, [notice_id], (error, db_data)=>{
              if (error) {
                  logger.error(
                      "DB error [notice]" +
                      "\n \t" + queryData +
                      "\n \t" + error);
                  reject('DB ERR');
              }
              resolve(db_data[0].cnt)
          })
      })
    },
    // downloadCount(parameter){
    //     return new Promise((resolve, reject)=>{
    //         const queryData = `SELECT`
    //     })
    // },
    detailNoticeFile(parameter){
      return new Promise((resolve, reject)=>{
          const queryData = `SELECT file_name FROM notice_file WHERE notice_id = ?`;
          db.query(queryData, [parameter.notice_id], (error, db_data)=>{
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
    detailNotice(parameter){
        return new Promise((resolve, reject)=>{
            const queryData = `SELECT title, content, create_time FROM notice WHERE group_id = ? AND notice_id=?`;
            db.query(queryData, [parameter.group_id, parameter.notice_id], (error, db_data)=>{
                if (error) {
                    logger.error(
                        "DB error [notice]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve(db_data[0])
            })
        })
    },
    createNotice(parameter) {
        return new Promise((resolve, reject) => {
            const queryData = `INSERT INTO notice (title, content, create_time, group_id)
                               VALUES (?, ?, ?, ?)`
            db.query(queryData, [parameter.title, parameter.content, parameter.create_time, parameter.group_id], (error, db_data) => {
                if (error) {
                    logger.error(
                        "DB error [notice]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve(db_data.insertId)
            })
        })
    },
    editNotice(parameter){
        return new Promise((resolve, reject)=>{
            const queryData = `UPDATE notice SET title=?, content=?, create_time=? WHERE notice_id = ? AND group_id = ?`;
            db.query(queryData, [parameter.title, parameter.content, parameter.create_time, parameter.notice_id, parameter.group_id], (error, db_data)=>{
                if (error) {
                    logger.error(
                        "DB error [notice]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve('공지사항변경')
            })
        })
    },
    insertFile(parameter, file) {
        return new Promise((resolve, reject)=>{
            const queryData = `INSERT INTO notice_file (notice_id, file_orgn_name, file_name, file_path, file_create_time) VALUES (?,?,?,?,?)`;
            db.query(queryData, [parameter.notice_id, file.originalname, file.filename, file.path, parameter.create_time], (error, db_data)=>{
                if (error) {
                    logger.error(
                        "DB error [notice_file]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve('공지사항 파일 추가 완료')
            })
        })
    },
    deleteNotice(parameter){
        return new Promise((resolve, reject)=>{
            const queryData = `UPDATE notice SET is_del = 'Y' WHERE notice_id = ?, group_id = ?`;
            db.query(queryData, [parameter.notice_id, parameter.group_id], (error, db_data)=>{
                if (error) {
                    logger.error(
                        "DB error [notice]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve('공지사항 삭제 완료')
            })
        })
    },
    deletefile(parameter){
      return new Promise((resolve, reject)=>{
          const queryData = `DELETE FROM notice_file WHERE notice_id = ?`;
          db.query(queryData, [parameter.notice_id], (error, db_data)=>{
              if (error) {
                  logger.error(
                      "DB error [notice_file]" +
                      "\n \t" + queryData +
                      "\n \t" + error);
                  reject('DB ERR');
              }
              resolve('공지사항 파일 삭제완료')
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