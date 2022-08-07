'use strict';

import db from '../../../config/db.js'; // const db = require('../config/db')

async function qnaAll() {
  const quertData = `SELECT * FROM program ORDER BY create_time desc`;
  const data = await db.query(quertData);
  return data;
}

export const qnaDAO = {
  qnaAll
};