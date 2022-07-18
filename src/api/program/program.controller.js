'use strict';

import {programDAO} from './DAO/program.dao.js'
import {noticeDAO} from '../notice/DAO/notice.dao.js'
import {userProgramAnswerDAO} from './DAO/userProgramAnswer.dao.js'
import {applyDepartmentDAO} from './DAO/applyDepartment.dao.js'
import dayjs from 'dayjs';
import {
    jwtMiddleware,
} from '../../modules/index.js'
import {BadRequestException} from "../../common/exceptions/index.js";

export const programCtrl = {
    async programAll(req, res) {
        let jwt_token = req.cookies.admin;
        let parameters = {}
        const permission = await jwtMiddleware.jwtCerti(jwt_token).catch(e => {
            throw new BadRequestException(e)
        });
        parameters.user_id = permission.STUDENT_ID;
        const program_data = await programDAO.programAll().catch(e => {
            throw new BadRequestException(e)
        });
        return program_data
    },
    async programAllApp(req, res) {
        let jwt_token = req.cookies.student;
        let parameters = {}
        const permission = await jwtMiddleware.jwtCerti(jwt_token).catch(e => {
            throw new BadRequestException(e)
        });
        parameters.user_id = permission.STUDENT_ID;
        const program_id_data = await noticeDAO.select_program_id().catch(e => {
            throw new BadRequestException(e)
        });
        let sendData = []
        for (let element of program_id_data) {
            const data = await programDAO.selectProgram(element).catch(e => {
                throw new BadRequestException(e)
            });
            if (data !== undefined) sendData.push({
                "program_id": data.program_id,
                "title": data.title,
                "startdate": data.startdate,
                "enddate": data.enddate,
                "mileage": data.mileage,
                "program_state": data.program_state,
            })
        }
        return sendData
    },
    async myprogramAll(req, res) {
        let jwt_token = req.cookies.student;
        let parameters = {}
        const permission = await jwtMiddleware.jwtCerti(jwt_token).catch(e => {
            throw new BadRequestException(e)
        });
        parameters.user_id = permission.STUDENT_ID;
        const program_data = await programDAO.myprogramAll(parameters).catch(e => {
            throw new BadRequestException(e)
        });
        return program_data
    },
    async deleteUserProgram(req, res) {
        let jwt_token = req.cookies.student;
        let parameters = {
            "program_id": req.body.program_id
        }
        const permission = await jwtMiddleware.jwtCerti(jwt_token).catch(e => {
            throw new BadRequestException(e)
        });
        parameters.user_id = permission.STUDENT_ID;
        const delete_user_program = await userProgramAnswerDAO.deleteUserProgram(parameters).catch(e => {
            throw new BadRequestException(e)
        });
        return true
    },
    async deleteProgram(req, res) {
        let jwt_token = req.cookies.admin;
        let parameters = {
            "program_id": req.body.program_id
        }
        const permission = await jwtMiddleware.jwtCerti(jwt_token).catch(e => {
            throw new BadRequestException(e)
        });
        await userProgramAnswerDAO.deleteUserProgramAll(parameters).catch(e => {
            throw new BadRequestException(e)
        })
        await programDAO.deleteProgram(parameters).catch(e => {
            throw new BadRequestException(e)
        })
        return true
    },
    async programWrite(req, res) {
        let {program_id, title, startdate, enddate, expirydate, mileage, apply_department} = req.body;
        let start_date = new dayjs().format(startdate, 'YYYY-MM-DD HH:mm:ss')
        let end_date = new dayjs().format(enddate, 'YYYY-MM-DD HH:mm:ss')
        let expiry_date = new dayjs().add(expirydate, 'year').format('YYYY-MM-DD HH:mm:ss')
        let datetime = new dayjs().format('YYYY-MM-DD HH:mm:ss');
        let parameters = {
            "program_id": program_id,
            "title": title,
            "startdate": start_date,
            "enddate": end_date,
            "expiry_date": expiry_date,
            "mileage": mileage,
            "create_date": datetime,
        }

        await programDAO.programWrite(parameters).catch(e => {
            throw new BadRequestException(e)
        });
        const programId = await programDAO.checkProgram(parameters).catch(e => {
            throw new BadRequestException(e)
        });

        await apply_department.forEach(function (data) {
            applyDepartmentDAO.insertApplyDepartment(programId, data).catch(e => {
                throw new BadRequestException(e)
            })
        })
        return true
    }
    ,
    async programUserAnswer(req, res) {
        let jwt_token = req.cookies.student;
        let {program_id, accept} = req.body;
        let datetime = new dayjs().format('YYYY-MM-DD HH:mm:ss');
        let parameters = {
            "program_id": program_id,
            "accept": accept,
            "application_date": datetime
        }
        let i;
        if (parameters.accept != "동의") throw new BadRequestException("개인정보동의에 동의하지 않았습니다.")
        const permission = await jwtMiddleware.jwtCerti(jwt_token).catch(e => {
            throw new BadRequestException(e)
        });
        parameters.user_id = permission.STUDENT_ID;

        await userProgramAnswerDAO.checkAnswer(parameters).catch(e => {
            throw new BadRequestException(e)
        })

        const checkApplyDepartment = await applyDepartmentDAO.checkApplyDepartment(parameters).catch(e => {
            throw new BadRequestException(e)
        })

        for (i = 0; i < checkApplyDepartment.length; i++) {
            if (checkApplyDepartment[i] == permission.DEPT_NM) {
                console.log('일치합니다.')
                break;
            }
        }
        if (i == checkApplyDepartment.length) throw new BadRequestException("신청할 수 없는 학과입니다.")

        await userProgramAnswerDAO.insertProgramAnswer(parameters).catch(e => {
            throw new BadRequestException(e)
        });
        return true
    }
}