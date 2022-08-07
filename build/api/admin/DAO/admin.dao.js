'use strict';

import db from '../../../config/db.js';
import logger from '../../../config/logger.js';

function adminAll() {
  return new Promise(function (resolve, reject) {
    let queryData = `SELECT user_id, name, department, level FROM user WHERE level=9`;
    db.query(queryData, function (error, db_data) {
      if (error) {
        logger.error("DB error [user]" + "\n \t" + queryData + "\n \t" + error);
        reject('DB ERR');
      }

      resolve(db_data);
    });
  });
}

function adminLevelUpdate(parameters) {
  return new Promise(function (resolve, reject) {
    let queryData = `UPDATE user SET level='${parameters.level}' WHERE user_id="${parameters.user_id}"`;
    db.query(queryData, function (error, db_data) {
      if (error) {
        logger.error("DB error [user]" + "\n \t" + queryData + "\n \t" + error);
        reject('DB ERR');
      }

      if (db_data.affectedRows == 1) resolve('수정 완료');else reject("해당하는 인원이 존재하지 않습니다.");
    });
  });
}

export const adminDAO = {
  adminAll,
  adminLevelUpdate
};