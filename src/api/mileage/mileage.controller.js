'use strict';

import programDAO from '../program/DAO/program.dao.js'
import userProgramAnswerDAO from '../program/DAO/userProgramAnswer.dao.js'
import mileageDAO from '../mileage/DAO/mileage.dao.js'
import dayjs from 'dayjs'
import {
    jwtCerti,
} from '../../modules/index.js'

export const mileageCtrl = {
    async mymileageApp(req, res, next) {
        let jwt_token = req.cookies.student;
        let parameters = {};
        try {
            if (jwt_token == undefined) { throw "로그인 정보가 없습니다." }
            const permission = await jwtCerti(jwt_token);
            parameters.user_id = permission.STUDENT_ID;

            const mileage_data = await mileageDAO.mymileageApp(parameters);

            res.json({
                "Message": "성공하였습니다.",
                "Data": mileage_data
            })
        }
        catch (error) {
            res.json({
                "Message": "실패하였습니다.",
                "Data": error
            })
        }
    },
    async selectProgram(req, res, next) {
        let jwt_token = req.cookies.admin;
        try {
            if (jwt_token == undefined) { throw "로그인 정보가 없습니다." }
            const permission = await jwtCerti(jwt_token);

            if (permission.LEVEL != 0 && permission.LEVEL != 1) throw "권한이 없습니다."

            const program_data = await programDAO.programAll();

            res.json({
                "Message": "성공하였습니다.",
                "Data": program_data
            })
        } catch (error) {
            res.json({
                "Message": "실패하였습니다.",
                "Error_Message": error
            })
        }
    },
    async detailProgramUser(req, res, next) {
        let jwt_token = req.cookies.admin;
        let parameters = {
            "program_id": req.body.program_id
        }
        try {
            if (jwt_token == undefined) { throw "로그인 정보가 없습니다." }
            const permission = await jwtCerti(jwt_token);

            if (permission.LEVEL != 0 && permission.LEVEL != 1) throw "권한이 없습니다."

            const program_answer_list = await userProgramAnswerDAO.selectAnswerList(parameters)
            res.json({
                "Message": "성공하였습니다.",
                "Data": program_answer_list
            })
        } catch (error) {
            res.json({
                "Message": "실패하였습니다.",
                "Error_Message": error
            })
        }
    },
    async selectMileage(req, res, next) {
        let jwt_token = req.cookies.student;
        let parameters = {}
        try {
            if (jwt_token == undefined) { throw "로그인 정보가 없습니다." }
            const permission = await jwtCerti(jwt_token);

            parameters.user_id = permission.STUDENT_ID
            const mileage_data = await mileageDAO.selectMileage(parameters)
            parameters.program_id = mileage_data.program_id;
            let sendData = []

            for (const element of mileage_data) {
                const data = await programDAO.checkProgramApp(element.program_id)
                sendData.push({ "title": data.title, "program_mileage": data.program_mileage, "mileage_date": element.mileage_date, "date_time": element.date_time })
            }

            res.json({
                "Message": "성공하였습니다.",
                "Data": sendData
            })
        } catch (error) {
            res.json({
                "Message": "실패하였습니다.",
                "Error_Message": error
            })
        }
    },
    async insertMileageUser(req, res, next) {
        let { program_id, target_user_id } = req.body
        let date = new dayjs();
        let datetime = date.format('YYYY-MM-DD HH:mm:ss');

        try {
            let jwt_token = req.cookies.admin;
            let parameters = {
                "program_id": program_id,
                "mileage_date": datetime
            }
            if (jwt_token == undefined) { throw "로그인 정보가 없습니다." }
            const permission = await jwtCerti(jwt_token);
            parameters.user_id = permission.STUDENT_ID;


            const data = await programDAO.checkProgramApp(parameters.program_id)
            parameters.mileage = data.program_mileage;

            await target_user_id.forEach(async function (user) {
                const insertmileage = await mileageDAO.insertMileage(parameters, user)
            })
            res.json({
                "Message": "성공하였습니다."
            })
        } catch (error) {
            res.json({
                "Message": "실패하였습니다.",
                "Error_Message": error
            })
        }
    },
    async SemesterMileage(req, res, next) {
        let jwt_token = req.cookies.student
        let parameters = {}
        try {
            if (jwt_token == undefined) { throw "로그인 정보가 없습니다." }
            const permission = await jwtCerti(jwt_token);

            parameters.user_id = permission.STUDENT_ID

            const mileage_data = await mileageDAO.SemesterMileage(parameters)

            res.json({
                "Message": "성공하였습니다.",
                "Data": mileage_data
            })
        }
        catch (error) {
            res.json({
                "Message": "실패하였습니다.",
                "Error_Message": error
            })
        }
    }
}