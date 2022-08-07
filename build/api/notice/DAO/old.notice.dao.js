"use strict";

import db from '../../../config/db.js';
import logger from '../../../config/logger.js';

function noticeAll() {
  return new Promise(function (resolve, reject) {
    let queryData = `SELECT count(NF.notice_id) AS file_count, N.notice_id, N.program_id, N.title, REPLACE(SUBSTR(N.create_time,1,10) ,"-",".") AS create_time, N.priority
        FROM notice N
        LEFT JOIN notice_file NF ON N.notice_id = NF.notice_id
        WHERE is_del=0
        GROUP BY notice_id
        ORDER BY create_time desc`; // console.log(queryData);

    db.query(queryData, function (error, db_data) {
      if (error) {
        logger.error("DB error [notice]" + "\n \t" + queryData + "\n \t" + error);
        reject("DB ERR");
      } // console.log(db_data);


      resolve(db_data);
    });
  });
}

function noticeDetail(parameters) {
  return new Promise(function (resolve, reject) {
    let queryData = `SELECT N.notice_id, N.title, REPLACE(REPLACE(N.content,CHR(10),""),CHR(13),"")AS content, u.name,
        GROUP_CONCAT(DISTINCT ap.apply_department SEPARATOR ' ') AS department,
        case when (NOW() < p.startdate) then '모집 예정'
             when (p.startdate <= NOW() AND NOW() <= p.enddate) then '모집 중'
             when (NOW() > p.enddate) then '모집 완료'
        END AS program_state
        FROM notice N
        LEFT JOIN applyDepartment_program ap ON ap.program_id = N.program_id
        JOIN user u ON u.user_id = N.user_id
        LEFT JOIN program p ON p.program_id = N.program_id
        WHERE N.notice_id = ${parameters.notice_id}
        GROUP BY N.notice_id;`;
    db.query(queryData, function (error, db_data) {
      if (error) {
        logger.error("DB error [notice]" + "\n \t" + queryData + "\n \t" + error);
        reject("DB ERR");
      }

      resolve(db_data);
    });
  });
}

function noticeDetailFile(parameters) {
  return new Promise(function (resolve, reject) {
    let queryData = `SELECT CONCAT('[',GROUP_CONCAT('"',nf.file_orgn_name,'"' SEPARATOR ','),']') AS file
        FROM notice_file nf
        RIGHT JOIN notice N ON N.notice_id = nf.notice_id
        WHERE N.notice_id = ${parameters}
        GROUP BY N.notice_id`;
    db.query(queryData, function (error, db_data) {
      // console.log(db_data)
      if (error) {
        logger.error("DB error [notice]" + "\n \t" + queryData + "\n \t" + error);
        reject("DB ERR");
      }

      resolve(db_data);
    });
  });
}

function noticeWatch(parameters) {
  return new Promise(function (resolve, reject) {
    var queryData = `SELECT DISTINCT u.user_id, u.name, u.department, NOW() AS notice_date
        FROM notice_checked nc
        LEFT JOIN notice n ON n.notice_id = nc.notice_id
        LEFT JOIN user u ON u.user_id = nc.user_id
        WHERE n.notice_id = ${parameters}
        ORDER BY notice_date desc;`;
    db.query(queryData, function (error, db_data) {
      if (error) {
        logger.error("DB error [notice]" + "\n \t" + queryData + "\n \t" + error);
        reject("DB ERR");
      } // if(db_data.affectedRows >= 1)


      resolve(db_data); // reject('존재하지 않는 공지사항입니다.');
    });
  });
}

function noticeWrite(parameters) {
  return new Promise(function (resolve, reject) {
    var queryData = `INSERT notice (user_id,program_id, title, content, create_time, priority) VALUES (?,?,?,?,?,?)`;
    db.query(queryData, [parameters.user_id, parameters.program_id, parameters.title, parameters.content, parameters.create_time, parameters.priority], function (error, db_data) {
      if (error) {
        logger.error("DB error [notice]" + "\n \t" + queryData + "\n \t" + error);
        reject('DB ERR');
      }

      resolve('공지사항 추가를 완료했습니다.');
    });
  });
}

function noticeDelete(parameters) {
  return new Promise(function (resolve, reject) {
    var queryData = `UPDATE notice set is_del = 1 WHERE notice_id = ?`;
    db.query(queryData, [parameters.notice_id], function (error, db_data) {
      if (error) {
        logger.error("DB error [notice]" + "\n \t" + queryData + "\n \t" + error);
        reject("DB ERR");
      }

      if (db_data.affectedRows == 1) resolve("공지사항 삭제를 완료했습니다.");
      reject("존재하지 않는 공지사항 입니다.");
    });
  });
}

function select_program_id() {
  return new Promise(function (resolve, reject) {
    let queryData = `SELECT program_id FROM notice WHERE NOT program_id IS NULL AND is_del =0`;
    db.query(queryData, function (error, db_data) {
      if (error) {
        logger.error("DB error [notice]" + "\n \t" + queryData + "\n \t" + error);
        reject("DB ERR");
      }

      resolve(db_data);
    });
  });
}

function select_notice_id(parameters) {
  return new Promise(function (resolve, reject) {
    let queryData = `SELECT notice_id FROM notice WHERE title=? AND content=? AND create_time=?`;
    db.query(queryData, [parameters.title, parameters.content, parameters.create_time], function (error, db_data) {
      if (error) {
        logger.error("DB error [notice]" + "\n \t" + queryData + "\n \t" + error);
        reject('DB ERR');
      }

      resolve(db_data[0].notice_id);
    });
  });
}

function insert_notice_file(parameters) {
  // console.log(parameters)
  return new Promise(function (resolve, reject) {
    let queryData = `INSERT INTO notice_file SET ?`;
    db.query(queryData, parameters, function (error, db_data) {
      if (error) {
        logger.error("DB error [notice_file]" + "\n \t" + queryData + "\n \t" + error);
        reject('DB ERR');
      }

      resolve('공지사항 파일 추가 완료하였습니다.');
    });
  });
}

export const noticeDAO = {
  noticeAll,
  noticeDetail,
  noticeWrite,
  noticeWatch,
  noticeDelete,
  noticeDetailFile,
  select_program_id,
  select_notice_id,
  insert_notice_file
};