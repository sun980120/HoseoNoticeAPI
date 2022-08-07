'use strict';

import { eventDAO } from './DAO/event.dao.js';
import dayjs from 'dayjs';
import { jwtMiddleware } from '../../modules/index.js';
import { BadRequestException } from "../../common/exceptions/index.js";
export const eventCtrl = {
  async eventMain(req, res, next) {
    let jwt_token = req.cookies.student; // let jwt_token = req.query.jwt_token;

    let parameters = {};
    const permission = await jwtMiddleware.jwtCerti(jwt_token).catch(e => {
      throw new BadRequestException(e);
    });
    const event_data = await eventDAO.eventMain().catch(e => {
      throw new BadRequestException(e);
    });
    return event_data;
  },

  async eventAll(req, res, next) {
    let jwt_token = req.cookies.admin;
    const permission = await jwtMiddleware.jwtCerti(jwt_token).catch(e => {
      throw new BadRequestException(e);
    });
    if (permission.LEVEL != 0 && permission.LEVEL != 1) throw new BadRequestException("권한이 없습니다");
    const event_data = await eventDAO.eventAll().catch(e => {
      throw new BadRequestException(e);
    });
    return event_data;
  },

  async eventWrite(req, res, next) {
    let {
      title,
      url,
      start_date,
      end_date,
      limits,
      is_enrolled,
      is_checked
    } = req.body; // let jwt_token = req.query.jwt_token;

    let jwt_token = req.cookies.admin;
    let startdate = new dayjs().format(start_date, 'YYYY-MM-DD HH:mm:ss');
    let enddate = new dayjs().format(end_date, 'YYYY-MM-DD HH:mm:ss');
    let parameters = {
      // "event_id" : event_id,
      "title": title,
      "url": url,
      "start_date": startdate,
      "end_date": enddate,
      "limits": limits,
      "is_enrolled": is_enrolled,
      "is_checked": is_checked
    };
    const permission = await jwtMiddleware.jwtCerti(jwt_token).catch(e => {
      throw new BadRequestException(e);
    });
    if (permission.LEVEL != 0 && permission.LEVEL != 1) throw new BadRequestException("권한이 없습니다.");
    await eventDAO.eventWrite(parameters).catch(e => {
      throw new BadRequestException(e);
    });
    return "성공했습니다.";
  },

  async eventUpdate(req, res, next) {
    let {
      event_id,
      title,
      url,
      start_date,
      end_date,
      limits,
      is_enrolled,
      is_checked
    } = req.body; // let jwt_token = req.query.jwt_token;

    let jwt_token = req.cookies.admin;
    let startdate = new dayjs().format(start_date, 'YYYY-MM-DD HH:mm:ss');
    let enddate = new dayjs().format(end_date, 'YYYY-MM-DD HH:mm:ss');
    let parameters = {
      "event_id": event_id,
      "title": title,
      "url": url,
      "start_date": startdate,
      "end_date": enddate,
      "limits": limits,
      "is_enrolled": is_enrolled,
      "is_checked": is_checked
    };
    const permission = await jwtMiddleware.jwtCerti(jwt_token).catch(e => {
      throw new BadRequestException(e);
    });

    if (permission.LEVEL != 0 && permission.LEVEL != 1) {
      throw "권한이 없습니다.";
    }

    const event_update = await eventDAO.eventUpdate(parameters);
    return "성공하였습니다.";
  },

  async eventEnrolled(req, res, next) {
    let {
      event_id,
      is_enrolled
    } = req.body; // let jwt_token = req.query.jwt_token;

    let jwt_token = req.cookies.admin;
    let parameters = {
      "event_id": event_id,
      "is_enrolled": is_enrolled
    };
    const permission = await jwtMiddleware.jwtCerti(jwt_token).catch(e => {
      throw new BadRequestException(e);
    });

    if (permission.LEVEL != 0 && permission.LEVEL != 1) {
      throw new BadRequestException("권한이 없습니다.");
    }

    const event_enrolled = await eventDAO.eventEnrolled(parameters).catch(e => {
      throw new BadRequestException(e);
    });
    return "성공하였습니다.";
  },

  async eventChecked(req, res, next) {
    let {
      event_id,
      is_checked
    } = req.body; // let jwt_token = req.query.jwt_token;

    let jwt_token = req.cookies.admin;
    let parameters = {
      "event_id": event_id,
      "is_checked": is_checked
    };
    const permission = await jwtMiddleware.jwtCerti(jwt_token).catch(e => {
      throw new BadRequestException(e);
    });

    if (permission.LEVEL != 0 && permission.LEVEL != 1) {
      throw new BadRequestException("권한이 없습니다.");
    }

    await eventDAO.eventChecked(parameters).catch(e => {
      throw new BadRequestException(e);
    });
    return "성공하였습니다.";
  },

  async eventDelete(req, res, next) {
    // let {event_id} = req.body;
    // let jwt_token = req.query.jwt_token;
    let jwt_token = req.cookies.admin;
    console.log(jwt_token);
    let parameters = {
      "event_id": req.body.event_id
    };
    const permission = await jwtMiddleware.jwtCerti(jwt_token).catch(e => {
      throw new BadRequestException(e);
    });
    if (permission.LEVEL != 0 && permission.LEVEL != 1) throw new BadRequestException("권한이 없습니다."); // console.log(parameters.event_id);

    const event_delete = await eventDAO.eventDelete(parameters).catch(e => {
      throw new BadRequestException(e);
    });
    return event_delete;
  }

};
/* 이벤트 상세 페이지
async function eventDetail(req, res, next){
    let jwt_token = req.query.jwt_token;
    // let jwt_token = req.cookies.admin;
    try {
        if(jwt_token == undefined)  {throw "로그인 정보가 없습니다."}
        const permission = await jwtMiddleware.jwtCerti(jwt_token);
        if(permission.LEVEL != 0 && permission.LEVEL != 1)  throw "권한이 없습니다.";
        const event_detail = await eventDAO.eventDetail();

        res.json({
            "Message" : "성공하였습니다.",
            "Data" : event_detail
        });
    }
    catch (error) {
        res.json({
            "Message" : "실패하였습니다.",
            "Error_Message" : error
        });
    }
}
*/