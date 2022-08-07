'use strict';

import db from '../../../config/db.js';
import logger from '../../../config/logger.js';

function programAll() {
  return new Promise(function (resolve, reject) {
    let queryData = `SELECT program_id, title, REPLACE(SUBSTR(startdate,1,10) ,"-",".") AS startdate, REPLACE(SUBSTR(enddate,1,10) ,"-",".") AS enddate, mileage,
        case when (NOW() < startdate) then '모집 예정'
            when (startdate <= NOW() AND NOW() <= enddate) then '모집 중'
            when (NOW() > enddate) then '모집 완료'
        END AS program_state,
        create_date
        FROM program
        WHERE is_del=0
        ORDER BY create_date DESC;`;
    db.query(queryData, function (error, db_data) {
      if (error) {
        logger.error("DB error [program]" + "\n \t" + queryData + "\n \t" + error);
        reject('DB ERR');
      }

      resolve(db_data);
    });
  });
}

function myprogramAll(parameters) {
  return new Promise(function (resolve, reject) {
    let queryData = `SELECT upa.user_id,p.program_id, p.title, REPLACE(SUBSTR(p.startdate,1,10), "-",".") AS startdate,
        REPLACE(SUBSTR(p.enddate,1,10), "-",".") AS enddate, p.mileage,
               case when (NOW() < p.startdate) then '모집 예정'
                    when (p.startdate <= NOW() AND NOW() <= p.enddate) then '모집 중'
                    when (NOW() > p.enddate) then '모집 완료'
                END AS program_state
        FROM user_program_answer upa
        JOIN program p ON upa.program_id = p.program_id
        WHERE upa.user_id = '${parameters.user_id}' AND p.is_del = 0
        ORDER BY p.enddate ASC;`;
    db.query(queryData, function (error, db_data) {
      if (error) {
        logger.error("DB error [user_program_answer + program]" + "\n \t" + queryData + "\n \t" + error);
        reject('DB ERR');
      }

      resolve(db_data);
    });
  });
}

function checkProgram(parameters) {
  return new Promise(function (resolve, reject) {
    let queryData = `SELECT program_id FROM program WHERE title=? AND mileage=?`;
    db.query(queryData, [parameters.title, parameters.mileage], function (error, db_data) {
      if (error) {
        logger.error("DB error [program]" + "\n \t" + queryData + "\n \t" + error);
        reject('DB ERR');
      }

      resolve(db_data[0].program_id);
    });
  });
}

function programWrite(parameters) {
  return new Promise(function (resolve, reject) {
    let queryData = `INSERT INTO program (program_id, title, startdate, enddate, expiry_date, mileage, create_date)
                         SELECT ${parameters.program_id},'${parameters.title}', '${parameters.startdate}', '${parameters.enddate}', '${parameters.expiry_date}', ${parameters.mileage}, '${parameters.create_date}'
                         FROM dual WHERE NOT EXISTS (SELECT * FROM program WHERE title = '${parameters.title}')`;
    db.query(queryData, function (error, db_data) {
      if (error) {
        logger.error("DB error [program]" + "\n \t" + queryData + "\n \t" + error);
        reject('DB ERR');
      }

      resolve('프로그램 추가 완료');
    });
  });
}

function deleteProgram(parameters) {
  return new Promise(function (resolve, reject) {
    let queryData = `UPDATE program SET is_del=1 WHERE program_id=?`;
    db.query(queryData, [parameters.program_id], function (error, db_data) {
      if (error) {
        logger.error("DB error [program]" + "\n \t" + queryData + "\n \t" + error);
        ps;
        reject('DB ERR');
      }

      if (db_data.affectedRows == 1) resolve('삭제 완료');else reject("해당하는 프로그램이 없습니다.");
    });
  });
}

function checkProgramApp(program_id) {
  return new Promise(function (resolve, reject) {
    let queryData = `SELECT title, (mileage) as program_mileage FROM program WHERE program_id = ?`;
    db.query(queryData, [program_id], function (error, db_data) {
      if (error) {
        logger.error("DB error [program]" + "\n \t" + queryData + "\n \t" + error);
        reject("DB ERR");
      }

      resolve(db_data[0]);
    });
  });
}

function selectProgram(parameters) {
  // console.log(parameters.program_id)
  return new Promise(function (resolve, reject) {
    let queryData = `SELECT program_id, title, REPLACE(SUBSTR(startdate,1,10) ,"-",".") AS startdate, REPLACE(SUBSTR(enddate,1,10) ,"-",".") AS enddate, mileage,
                                case when (NOW() < startdate) then '모집 예정'
                                     when (startdate <= NOW() AND NOW() <= enddate) then '모집 중'
                                     when (NOW() > enddate) then '모집 완료'
                                    END AS program_state
                         FROM program
                         WHERE is_del=0 AND program_id = ?`;
    db.query(queryData, [parameters.program_id], function (error, db_data) {
      if (error) {
        logger.error("DB error [program]" + "\n \t" + queryData + "\n \t" + error);
        reject("DB ERR");
      } // console.log(db_data[0])


      resolve(db_data[0]);
    });
  });
}

export const programDAO = {
  programAll,
  myprogramAll,
  checkProgram,
  programWrite,
  deleteProgram,
  checkProgramApp,
  selectProgram
};