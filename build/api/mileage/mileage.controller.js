'use strict';

import { programDAO } from '../program/DAO/program.dao.js';
import { userProgramAnswerDAO } from '../program/DAO/userProgramAnswer.dao.js';
import { mileageDAO } from './/DAO/mileage.dao.js';
import dayjs from 'dayjs';
import { jwtMiddleware } from '../../modules/index.js';
import { BadRequestException } from "../../common/exceptions/index.js";
export const mileageCtrl = {
  async mymileageApp(req, res, next) {
    let jwt_token = req.cookies.student;
    let parameters = {};
    const permission = await jwtMiddleware.jwtCerti(jwt_token).catch(e => {
      throw new BadRequestException(e);
    });
    parameters.user_id = permission.STUDENT_ID;
    const mileage_data = await mileageDAO.mymileageApp(parameters).catch(e => {
      throw new BadRequestException(e);
    });
    return mileage_data;
  },

  async selectProgram(req, res, next) {
    let jwt_token = req.cookies.admin;
    const permission = await jwtMiddleware.jwtCerti(jwt_token).catch(e => {
      throw new BadRequestException(e);
    });
    if (permission.LEVEL != 0 && permission.LEVEL != 1) throw new BadRequestException("권한이 없습니다.");
    const program_data = await programDAO.programAll().catch(e => {
      throw new BadRequestException(e);
    });
    return program_data;
  },

  async detailProgramUser(req, res, next) {
    let jwt_token = req.cookies.admin;
    let parameters = {
      "program_id": req.body.program_id
    };
    const permission = await jwtMiddleware.jwtCerti(jwt_token).catch(e => {
      throw new BadRequestException(e);
    });
    if (permission.LEVEL != 0 && permission.LEVEL != 1) throw new BadRequestException("권한이 없습니다.");
    const program_answer_list = await userProgramAnswerDAO.selectAnswerList(parameters).catch(e => {
      throw new BadRequestException(e);
    });
    return program_answer_list;
  },

  async selectMileage(req, res, next) {
    let jwt_token = req.cookies.student;
    let parameters = {};
    const permission = await jwtMiddleware.jwtCerti(jwt_token).catch(e => {
      throw new BadRequestException(e);
    });
    parameters.user_id = permission.STUDENT_ID;
    const mileage_data = await mileageDAO.selectMileage(parameters).catch(e => {
      throw new BadRequestException(e);
    });
    parameters.program_id = mileage_data.program_id;
    let sendData = [];

    for (const element of mileage_data) {
      const data = await programDAO.checkProgramApp(element.program_id).catch(e => {
        throw new BadRequestException(e);
      });
      sendData.push({
        "title": data.title,
        "program_mileage": data.program_mileage,
        "mileage_date": element.mileage_date,
        "date_time": element.date_time
      });
    }

    return sendData;
  },

  async insertMileageUser(req, res, next) {
    let {
      program_id,
      target_user_id
    } = req.body;
    let datetime = new dayjs().format('YYYY-MM-DD HH:mm:ss');
    let jwt_token = req.cookies.admin;
    let parameters = {
      "program_id": program_id,
      "mileage_date": datetime
    };
    const permission = await jwtMiddleware.jwtCerti(jwt_token).catch(e => {
      throw new BadRequestException(e);
    });
    parameters.user_id = permission.STUDENT_ID;
    const data = await programDAO.checkProgramApp(parameters.program_id).catch(e => {
      throw new BadRequestException(e);
    });
    parameters.mileage = data.program_mileage;
    await target_user_id.forEach(function (user) {
      mileageDAO.insertMileage(parameters, user).catch(e => {
        throw new BadRequestException(e);
      });
    });
    return "성공하였습니다.";
  },

  async SemesterMileage(req, res, next) {
    let jwt_token = req.cookies.student;
    let parameters = {};
    const permission = await jwtMiddleware.jwtCerti(jwt_token).catch(e => {
      throw new BadRequestException(e);
    });
    parameters.user_id = permission.STUDENT_ID;
    const mileage_data = await mileageDAO.SemesterMileage(parameters).catch(e => {
      throw new BadRequestException(e);
    });
    return mileage_data;
  }

};