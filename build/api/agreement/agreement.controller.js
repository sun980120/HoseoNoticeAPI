'use strict';

import { agreementDAO } from '../agreement/DAO/agreement.dao.js';
import { authDAO } from '../auth/DAO/auth.dao.js';
import dayjs from 'dayjs';
import { BadRequestException } from '../../common/exceptions/index.js';
import { jwtMiddleware } from '../../modules/index.js';
export const agreementCtrl = {
  async make_agreement(req, res, next) {
    let jwt_token = req.cookies.admin;
    let datetime = new dayjs().format('YYYY-MM-DD HH:mm:ss');
    let {
      content,
      version
    } = req.body;
    let parameters = {
      "date": datetime,
      "agreement_id": version,
      "content": escape(content)
    };
    const permission = await jwtMiddleware.jwtCerti(jwt_token);
    if (permission.LEVEL != 0 && permission.LEVEL != 1) throw new BadRequestException("권한이 없습니다.");
    await agreementDAO.agreementInsert(parameters).catch(e => {
      throw new BadRequestException(e);
    });
    await authDAO.agreementUpdate(parameters).catch(e => {
      throw new BadRequestException(e);
    });
    return "성공하였습니다.";
  },

  async read_agreement(req, res, next) {
    const agreement_data = await agreementDAO.agreementRead().catch(e => {
      throw new BadRequestException(e);
    });
    const html_agreement = unescape(agreement_data[0].content);
    let result = {
      "agreement_id": agreement_data[0].agreement_id,
      "content": html_agreement
    };
    return result;
  }

};