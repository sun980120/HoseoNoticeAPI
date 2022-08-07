import db from '../../../config/db.js';
import logger from '../../../config/logger.js';
export const pushDao = {
  getMyPushLog(parameter) {
    return new Promise((resolve, reject) => {
      const queryData = `SELECT pl.push_id, pl.push_title, pl.push_content, pl.push_date
                               FROM push_user AS pu
                                        RIGHT JOIN push_log AS pl ON pu.push_id = pl.push_id
                               WHERE pu.user_id = ?`;
      db.query(queryData, [parameter.user_id], (error, db_data) => {
        if (error) {
          logger.error("DB error [push_user & push_log]" + "\n \t" + queryData + "\n \t" + error);
          reject('DB ERR');
        }

        resolve(db_data);
      });
    });
  }

};