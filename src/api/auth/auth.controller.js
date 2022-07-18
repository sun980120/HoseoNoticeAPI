'use strict';

import {authDAO} from './DAO/auth.dao.js'
import {oracleDAO} from '../../config/oracleDB.js';
import {agreementDAO} from '../agreement/DAO/agreement.dao.js'
import dayjs from 'dayjs'
import {BadRequestException} from '../../common/exceptions/index.js'
import {
    jwtMiddleware,
} from '../../modules/index.js'
import crypto from "crypto";

export const authCtrl = {
    async logout(req, res, next) {
        res.clearCookie('student');
        return "Logout Success"
    },
    async AppPush(req, res, next) {
        let {active, device_token} = req.body;
        let user = req.cookies.student;

        const permission = await jwtMiddleware.jwtCerti(user)

        let parameters = {
            "push_active": active,
            "device_token": device_token,
            "user_id": permission.STUDENT_ID
        }
        let updatePushDeviceToken
        if (parameters.push_active == '동의') updatePushDeviceToken = await authDAO.updatePushDeviceToken(parameters).catch(e => {
            throw new BadRequestException(e)
        })
        else if (parameters.push_active == '미동의') updatePushDeviceToken = await authDAO.updateNotPushDeviceToken(parameters).catch(e => {
            throw new BadRequestException(e)
        })
        return true
    },
    async loginP(req, res) {
        let parameters = {
            "user_id": req.body.user_id,
            "pwd": crypto.createHash('sha512').update(req.body.pwd).digest('base64')
        }
        const result = await oracleDAO.authLogin(parameters).catch(e => {
            throw new BadRequestException(e)
        })
        parameters.name = result.NM;
        parameters.phone = result.M_PHONE;
        parameters.department = result.DEPT_NM;
        parameters.addr = result.ADDR;

        if (result.SCHYR != '') parameters.SCHYR = result.SCHYR;
        else parameters.SCHYR = "교직원";

        if (result.SCHYR != '') parameters.GRAD_YN = result.GRAD_YN;
        else parameters.GRAD_YN = "N";

        await authDAO.insertUser(parameters).catch(e => {
            throw new BadRequestException(e)
        })
        const level = await authDAO.checkLevel(parameters).catch(e => {
            throw new BadRequestException(e)
        })
        const userData = {
            "STUDENT_ID": parameters.user_id,
            "NM": parameters.name,
            "LEVEL": level,
            "DEPT_NM": parameters.department,
            "SCHYR": parameters.SCHYR,
        }
        const jwtToken = await jwtMiddleware.jwtCreateApp(userData).catch(e => {
            throw new BadRequestException(e)
        })
        res.cookie("student", jwtToken);
        parameters.jwt_token = jwtToken;

        await authDAO.insertJWT(parameters).catch(e => {
            throw new BadRequestException(e)
        })
        const accept = await authDAO.checkAccept(parameters).catch(e => {
            throw new BadRequestException(e)
        })

        let send_result = {
            "user_id": parameters.user_id,
            "name": parameters.name,
            "department": parameters.department,
            "grade": parameters.SCHYR,
            "jwt_token": parameters.jwt_token,
            "accept": accept,
        }
        return send_result
    },
    async loginOracle(req, res, next) {
        let parameters = {
            "user_id": req.body.user_id,
            "pwd": crypto.createHash('sha512').update(req.body.pwd).digest('base64')
            // "pwd": req.body.pwd
        }
        // const result = await oracleDAO.authLoginOracle(parameters);
        const result = await oracleDAO.userCheck(parameters).catch(e => {
            throw new BadRequestException(e)
        })
        if (!result) throw new BadRequestException("학번 혹은 포털 SW 개인정보 동의를 확인해주세요")
        // if (result.PASS !== parameters.pwd) throw new BadRequestException("비밀번호가 틀렸습니다")
        parameters.name = result.NM;
        parameters.phone = result.HAND_PHONE;
        parameters.department = result.DEPT_NM;
        if (result.SCHYR != '') parameters.SCHYR = result.SCHYR;
        else parameters.SCHYR = "교직원";
        if (result.SCHYR != '') parameters.GRAD_YN = result.GRAD_YN;
        else parameters.GRAD_YN = "N";
        await authDAO.insertUser(parameters).catch(e => {
            throw new BadRequestException(e)
        })
        const level = await authDAO.checkLevel(parameters).catch(e => {
            throw new BadRequestException(e)
        })
        const userData = {
            "STUDENT_ID": parameters.user_id,
            "NM": parameters.name,
            "LEVEL": level,
            "DEPT_NM": parameters.department,
            "SCHYR": parameters.SCHYR,
        }
        const jwtToken = await jwtMiddleware.jwtCreateApp(userData).catch(e => {
            throw new BadRequestException(e)
        });
        res.cookie("student", jwtToken);
        parameters.jwt_token = jwtToken;
        await authDAO.insertJWT(parameters).catch(e => {
            throw new BadRequestException(e)
        });
        const accept = await authDAO.checkAccept(parameters).catch(e => {
            throw new BadRequestException(e)
        });
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
    },
    async acceptP(req, res, next) {
        let user_id = req.body.user_id;
        let agreement_id = req.body.agreement_id;
        let datetime = new dayjs().format('YYYY-MM-DD HH:mm:ss');
        if (user_id == undefined) throw new BadRequestException("Parameter ERR.")
        let parameters = {
            "user_id": user_id,
            "agreement_id": agreement_id,
            "checked_date": datetime
        }
        await agreementDAO.userAgreementCheck(parameters).catch(e => {
            throw new BadRequestException(e)
        })
        await authDAO.updateAccept(parameters).catch(e => {
            throw new BadRequestException(e)
        })
        await agreementDAO.user_agreementInsert(parameters).catch(e => {
            throw new BadRequestException(e)
        })
        return "성공하였습니다."
    }
}