'use strict';

import { qnaDAO } from './DAO/qna.dao.js';
export const qnaCtrl = {
  async qnaMain(req, res, next) {
    res.render('./qna/qna', {
      title: 'QnA'
    });
  }

};