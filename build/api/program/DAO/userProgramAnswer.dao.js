'use strict';

import db from '../../../config/db.js';
import logger from '../../../config/logger.js';

function checkAnswer(parameters) {
  return new Promise(function (resolve, reject) {
    let queryData = `SELECT * FROM user_program_answer WHERE user_id=? AND program_id=?`;
    db.query(queryData, [parameters.user_id, parameters.program_id], function (error, db_data) {
      if (error) {
        logger.error("DB error [user_program_answer]" + "\n \t" + queryData + "\n \t" + error);
        reject('DB ERR'); // throw error;
      }

      console.log(db_data[0]);
      if (db_data[0] == undefined) resolve('신청가능');else reject('이미 신청 하였습니다.');
    });
  });
}

function deleteUserProgram(parameters) {
  return new Promise(function (resolve, reject) {
    let queryData = `DELETE FROM user_program_answer WHERE user_id='${parameters.user_id}' AND program_id='${parameters.program_id}'`;
    db.query(queryData, function (error, db_data) {
      if (error) {
        logger.error("DB error [user_program_answer]" + "\n \t" + queryData + "\n \t" + error);
        reject('DB ERR'); // throw error;
      }

      if (db_data.affectedRows == 1) resolve('프로그램 신청 취소 완료하였습니다.');
      reject('신청하지 않은 프로그램 입니다.');
    });
  });
}

function insertProgramAnswer(parameters) {
  return new Promise(function (resolve, reject) {
    let queryData = `INSERT INTO user_program_answer (user_id, program_id, accept, application_date) 
        SELECT '${parameters.user_id}', '${parameters.program_id}', '동의', '${parameters.application_date}' 
        FROM dual WHERE NOT EXISTS (SELECT user_id, program_id, accept, application_date FROM user_program_answer WHERE user_id='${parameters.user_id}' AND program_id='${parameters.program_id}')`;
    db.query(queryData, function (error, db_data) {
      if (error) {
        logger.error("DB error [user_program_answer]" + "\n \t" + queryData + "\n \t" + error);
        reject('DB ERR');
      }

      resolve('프로그램 신청 완료');
    });
  });
}

function deleteUserProgramAll(parameters) {
  return new Promise(function (resolve, reject) {
    let queryData = `DELETE FROM user_program_answer WHERE program_id=?`;
    db.query(queryData, [parameters.program_id], function (error, db_data) {
      if (error) {
        logger.error("DB error [user_program_answer]" + "\n \t" + queryData + "\n \t" + error);
        reject('DB ERR');
      }

      resolve('프로그램 신청한 사용자 모두 삭제 완료');
    });
  });
}

function selectAnswerList(parameters) {
  return new Promise(function (resolve, reject) {
    let queryData = `SELECT us.name, us.department, us.user_id, us.grade, p.mileage FROM user AS us JOIN user_program_answer AS upa JOIN program AS p ON us.user_id = upa.user_id && upa.program_id = p.program_id WHERE upa.program_id=?`;
    db.query(queryData, [parameters.program_id], function (error, db_data) {
      if (error) {
        logger.error("DB error [user_program_answer + user + program]" + "\n \t" + queryData + "\n \t" + error);
        reject('DB ERR');
      }

      resolve(db_data[0]);
    });
  });
}

export const userProgramAnswerDAO = {
  checkAnswer,
  deleteUserProgramAll,
  deleteUserProgram,
  insertProgramAnswer,
  selectAnswerList
};