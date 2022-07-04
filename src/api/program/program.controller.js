'use strict';

import programDAO from './DAO/program.dao.js'
import noticeDAO from '../notice/DAO/notice.dao.js'
import userProgramAnswerDAO from './DAO/userProgramAnswer.dao.js'
import applyDepartmentDAO from './DAO/userProgramAnswer.dao.js'
import dayjs from 'dayjs';
import {
    jwtCerti,
} from '../../modules/index.js'

export const programCtrl = {
    async programAll(req, res) {
        let jwt_token = req.cookies.admin;
        let parameters = {}
        try {
            if (jwt_token == undefined) { throw "로그인 정보가 없습니다." }
            const permission = await jwtCerti(jwt_token);
            parameters.user_id = permission.STUDENT_ID;
            const program_data = await programDAO.programAll();

            res.json({
                "Message": "성공하였습니다.",
                "Data": program_data
            })
        } catch (error) {
            res.json({
                "Message": "실패하였습니다.",
                "Error_Message": error,
            })

        }
    },
    async programAllApp(req, res) {
        let jwt_token = req.cookies.student;
        let parameters = {}
        try {
            if (jwt_token == undefined) { throw "로그인 정보가 없습니다." }
            const permission = await jwtCerti(jwt_token);
            parameters.user_id = permission.STUDENT_ID;
            const program_id_data = await noticeDAO.select_program_id();
            let sendData = []
            for (let element of program_id_data) {
                const data = await programDAO.selectProgram(element);
                if (data !== undefined) sendData.push({ "program_id": data.program_id, "title": data.title, "startdate": data.startdate, "enddate": data.enddate, "mileage": data.mileage, "program_state": data.program_state, })
            }
            res.json({
                "Message": "성공하였습니다.",
                "Data": sendData
            })
        } catch (error) {
            res.json({
                "Message": "실패하였습니다.",
                "Error_Message": error,
            })

        }
    },
    async myprogramAll(req, res) {
        let jwt_token = req.cookies.student;
        let parameters = {}
        try {
            if (jwt_token == undefined) { throw "로그인 정보가 없습니다." }
            const permission = await jwtCerti(jwt_token);
            parameters.user_id = permission.STUDENT_ID;
            const program_data = await programDAO.myprogramAll(parameters);

            res.json({
                "Message": "성공하였습니다.",
                "Data": program_data
            })
        } catch (error) {
            res.json({
                "Message": "실패하였습니다.",
                "Error_Message": error,
            })

        }
    },
    async deleteUserProgram(req, res) {
        let jwt_token = req.cookies.student;
        let parameters = {
            "program_id": req.body.program_id
        }
        try {
            if (jwt_token == undefined) { throw "로그인 정보가 없습니다." }
            const permission = await jwtCerti(jwt_token);
            parameters.user_id = permission.STUDENT_ID;
            const delete_user_program = await userProgramAnswerDAO.deleteUserProgram(parameters);

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
    async deleteProgram(req, res) {
        let jwt_token = req.cookies.admin;
        let parameters = {
            "program_id": req.body.program_id
        }
        try {
            if (jwt_token == undefined) { throw "로그인 정보가 없습니다." }
            const permission = await jwtCerti(jwt_token);
            if (permission.LEVEL != 0 && permission.LEVEL != 1) throw "권한이 없습니다."

            const delete_user_program = await userProgramAnswerDAO.deleteUserProgramAll(parameters)
            const delete_program = await programDAO.deleteProgram(parameters);

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
    async programWrite(req, res) {
        let { program_id, title, startdate, enddate, expirydate, mileage, apply_department } = req.body;
        let jwt_token = req.cookies.admin;
        let date = new dayjs();
        let start_date = date.format(startdate, 'YYYY-MM-DD HH:mm:ss')
        let end_date = date.format(enddate, 'YYYY-MM-DD HH:mm:ss')
        let expiry_date = date.add(expirydate, 'year').format('YYYY-MM-DD HH:mm:ss')
        let datetime = date.format('YYYY-MM-DD HH:mm:ss');
        let parameters = {
            "program_id": program_id,
            "title": title,
            "startdate": start_date,
            "enddate": end_date,
            "expiry_date": expiry_date,
            "mileage": mileage,
            "create_date": datetime,
        }
        try {
            if (jwt_token == undefined) { throw "로그인 정보가 없습니다." }
            const permission = await jwtCerti(jwt_token);
            if (permission.LEVEL != 0 && permission.LEVEL != 1) throw "권한이 없습니다."

            const insertProgram = await programDAO.programWrite(parameters);
            const program_id = await programDAO.checkProgram(parameters);

            await apply_department.forEach(function (data) {
                const insertdepartment = applyDepartmentDAO.insertApplyDepartment(program_id, data)
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
    async programUserAnswer(req, res) {
        let jwt_token = req.cookies.student;
        let { program_id, accept } = req.body;
        let date = new dayjs();
        let datetime = date.format('YYYY-MM-DD HH:mm:ss');
        let parameters = {
            "program_id": program_id,
            "accept": accept,
            "application_date": datetime
        }
        try {
            if (jwt_token == undefined) { throw "로그인 정보가 없습니다." }
            let i;
            if (parameters.accept != "동의") throw "개인정보동의에 동의하지 않았습니다."
            const permission = await jwtCerti(jwt_token);
            parameters.user_id = permission.STUDENT_ID;

            const checkAnswer = await userProgramAnswerDAO.checkAnswer(parameters)

            const checkApplyDepartment = await applyDepartmentDAO.checkApplyDepartment(parameters)

            for (i = 0; i < checkApplyDepartment.length; i++) {
                if (checkApplyDepartment[i] == permission.DEPT_NM) {
                    console.log('일치합니다.')
                    break;
                }
            }
            if (i == checkApplyDepartment.length) throw "신청할 수 없는 학과입니다."

            const programUserAnswer = await userProgramAnswerDAO.insertProgramAnswer(parameters);

            res.json({
                "Message": "성공하였습니다."
            })
        } catch (error) {
            res.json({
                "Message": "실패하였습니다.",
                "Error_Message": error
            })
        }
    }
}