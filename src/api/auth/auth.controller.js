'use strict';

import authDAO from './DAO/auth.dao.js'
import oracleUserDAO from '../../config/oracleDB.js';
import agreementDAO from '../agreement/DAO/agreement.dao.js'
import dayjs from 'dayjs'
import {BadRequestException} from '../../common/exceptions/index.js'
import {
    jwtCerti,
    jwtCreateApp,
} from '../../modules/index.js'

export const authCtrl = {
    async logout(req, res, next) {
        let user = req.cookies.student;
        res.clearCookie('student').redirect('/');
    },
    async AppPush(req, res, next) {
        try {
            let {active, device_token} = req.body;
            let user = req.cookies.student;

            const permission = await jwtCerti(user);
            let parameters = {
                "push_active": active,
                "device_token": device_token,
                "user_id": permission.STUDENT_ID
            }
            let updatePushDeviceToken
            if (parameters.push_active == '동의') updatePushDeviceToken = await authDAO.updatePushDeviceToken(parameters)
            else if (parameters.push_active == '미동의') updatePushDeviceToken = await authDAO.updateNotPushDeviceToken(parameters)
            return true
        } catch (e) {
            throw new BadRequestException(e)
        }
    },
    async loginP(req, res) {
        let parameters = {
            "user_id": req.body.user_id,
            "pwd": crypto.createHash('sha512').update(req.body.pwd).digest('base64')
        }
        try {
            const result = await oracleUserDAO.authLogin(parameters);
            parameters.name = result.NM;
            parameters.phone = result.M_PHONE;
            parameters.department = result.DEPT_NM;
            parameters.addr = result.ADDR;

            if (result.SCHYR != '') parameters.SCHYR = result.SCHYR;
            else parameters.SCHYR = "교직원";

            if (result.SCHYR != '') parameters.GRAD_YN = result.GRAD_YN;
            else parameters.GRAD_YN = "N";

            await authDAO.insertUser(parameters);
            const level = await authDAO.checkLevel(parameters)
            const userData = {
                "STUDENT_ID": parameters.user_id,
                "NM": parameters.name,
                "LEVEL": level,
                "DEPT_NM": parameters.department,
                "SCHYR": parameters.SCHYR,
            }
            const jwtToken = await jwtCreateApp(userData);

            res.cookie("student", jwtToken);
            parameters.jwt_token = jwtToken;

            const insertJWT = await authDAO.insertJWT(parameters);
            const accept = await authDAO.checkAccept(parameters);

            let send_result = {
                "user_id": parameters.user_id,
                "name": parameters.name,
                "department": parameters.department,
                "grade": parameters.SCHYR,
                "jwt_token": parameters.jwt_token,
                "accept": accept,
            }
            return send_result
        } catch (error) {
            throw new BadRequestException(error)
        }
    },
    async loginOracle(req, res, next) {
        let parameters = {
            "user_id": req.body.user_id,
            // "pwd": crypto.createHash('sha512').update(req.body.pwd).digest('base64')
            "pwd": req.body.pwd
        }
        try {
            // const result = await oracleUserDAO.authLoginOracle(parameters);
            const result = await oracleUserDAO.userCheck(parameters);
            if (!result) throw "학번 혹은 포털 SW 개인정보 동의를 확인해주세요"
            if (result.PASS !== parameters.pwd) throw "비밀번호가 틀렸습니다"
            parameters.name = result.NM;
            parameters.phone = result.HAND_PHONE;
            parameters.department = result.DEPT_NM;
            if (result.SCHYR != '') parameters.SCHYR = result.SCHYR;
            else parameters.SCHYR = "교직원";
            if (result.SCHYR != '') parameters.GRAD_YN = result.GRAD_YN;
            else parameters.GRAD_YN = "N";
            await authDAO.insertUxser(parameters);
            const level = await authDAO.checkLevel(parameters)
            const userData = {
                "STUDENT_ID": parameters.user_id,
                "NM": parameters.name,
                "LEVEL": level,
                "DEPT_NM": parameters.department,
                "SCHYR": parameters.SCHYR,
            }
            const jwtToken = await jwtCreateApp(userData);
            res.cookie("student", jwtToken);
            parameters.jwt_token = jwtToken;
            const insertJWT = await authDAO.insertJWT(parameters);
            const accept = await authDAO.checkAccept(parameters);
            let send_result = {
                "type": 1,
                "user_id": parameters.user_id,
                "name": parameters.name,
                "department": parameters.department,
                "grade": parameters.SCHYR,
                "jwt_token": parameters.jwt_token,
                "accept": accept,
            }
            return send_result
        } catch (e) {
            throw new BadRequestException(e)
        }
    },
    async acceptP(req, res, next) {
        let user_id = req.body.user_id;
        let agreement_id = req.body.agreement_id;
        let date = new dayjs();
        let datetime = date.format('YYYY-MM-DD HH:mm:ss');
        if (user_id == undefined) {
            res.json({"Message": "Parameter ERR."})
            return 0;
        }
        let parameters = {
            "user_id": user_id,
            "agreement_id": agreement_id,
            "checked_date": datetime
        }
        try {
            const accept = await agreementDAO.userAgreementCheck(parameters)

            console.log(accept)

            const acceptUpdate = await authDAO.updateAccept(parameters);
            const accept_data = await agreementDAO.user_agreementInsert(parameters);
            res.json({
                "Message": "성공하였습니다.",
            })
        } catch (error) {
            res.status(200).json({
                "Message": "실패하였습니다.",
                "Error_Message": error
            })
        }
    }
}