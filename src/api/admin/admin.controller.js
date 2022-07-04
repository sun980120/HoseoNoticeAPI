'use strict';

import adminDAO from './DAO/admin.dao.js'
import oracleUserDAO from '../../config/oracleDB.js';
import authDAO from '../auth/DAO/auth.dao.js';
import crypto from 'crypto';
import {
    jwtCerti,
    jwtCreate,
} from '../../modules/index.js'
const { isMap } = require('util/types');

export const adminCtrl = {
    async logout(req,res){
        let user = req.cookies.admin;
        res.clearCookie('admin');
        res.redirect('/');
    },
    async adminLogin(req, res) {
        let jwt_token = req.cookies.admin;
        let { user_id, password } = req.body;
        let parameters = {
            "user_id": user_id,
            "pwd": crypto.createHash('sha512').update(password).digest('base64'),
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

            if (parameters.SCHYR != "교직원") throw "학생은 접근할수 없습니다.";

            let db_data = await authDAO.insertUser(parameters);

            let level = await authDAO.checkLevel(parameters);

            if (level == 8) { await authDAO.updateLEVEL(parameters); throw "관리자 승인요청을 하겠습니다." }
            else if (level == 9) { throw "승인 요청 중입니다. 잠시만 기다려 주세요." }
            const userData = {
                "STUDENT_ID": parameters.user_id,
                "NM": parameters.name,
                "LEVEL": level,
                "DEPT_NM": parameters.department,
                "SCHYR": parameters.SCHYR,
            }
            const jwtToken = await jwtCreate(userData);
            res.cookie("admin", jwtToken);
            parameters.jwt_token = jwtToken;
            await authDAO.insertJWT(parameters);
            res.json({
                "Message": "성공하였습니다.",
                "Data": {
                    "name": parameters.name,
                    "phone": parameters.phone,
                    "level": level,
                },
                "jwt_token": jwtToken,
            })
        } catch (error) {
            res.json({
                "Message": "실패하였습니다.",
                "Error_Message": error
            })
        }
    },
    async adminLoginOracle(req, res) {
        let { user_id, pwd } = req.body;
        let parameters = {
            "user_id": user_id,
            // "pwd": crypto.createHash('sha512').update(password).digest('base64'),
            "pwd": req.body.pwd
        }
        try {
            const result = await oracleUserDAO.userCheck(parameters);
            if(result){
                if(result.PASS == parameters.pwd){
                    parameters.name = result.NM;
                    parameters.phone = result.HAND_PHONE;
                    parameters.department = result.DEPT_NM;
                    if (result.SCHYR != '') parameters.SCHYR = result.SCHYR;
                    else parameters.SCHYR = "교직원";
                    if (result.SCHYR != '') parameters.GRAD_YN = result.GRAD_YN;
                    else parameters.GRAD_YN = "N";
                    if(parameters.user_id=="20171134"||parameters.user_id=="20171283"||parameters.user_id=="20205552"){//임시 로그인 가능하게

                    }else{
                        if (parameters.SCHYR != "교직원") throw "학생은 접근할수 없습니다.";
                    }
                    let db_data = await authDAO.insertUser(parameters);
                    let level = await authDAO.checkLevel(parameters);
                    if (level == 8) { await authDAO.updateLEVEL(parameters); throw "관리자 승인요청을 하겠습니다." }
                    else if (level == 9) { throw "승인 요청 중입니다. 잠시만 기다려 주세요." }
                    const userData = {
                        "STUDENT_ID": parameters.user_id,
                        "NM": parameters.name,
                        "LEVEL": level,
                        "DEPT_NM": parameters.department,
                        "SCHYR": parameters.SCHYR,
                    }
                    const jwtToken = await jwtCreate(userData);
                    res.cookie("admin", jwtToken);
                    parameters.jwt_token = jwtToken;
                    await authDAO.insertJWT(parameters);
                    res.json({
                        "Message": "성공하였습니다.",
                        "type":1,
                        "Data": {
                            "name": parameters.name,
                            "phone": parameters.phone,
                            "level": level,
                        },
                        "jwt_token": jwtToken,
                    })
                }else{
                    res.status(200).json({
                        "Message": "실패하였습니다.",
                        "type":2,
                        "Error_Message": "비밀번호가 틀렸습니다",
                        "Data": {
                            "user_id": "",
                            "name": "",
                            "department": "",
                            "grade": "",
                            "jwt_token": "",
                            "accept": "",
                        },
                    })
                }
            }else{
                res.status(200).json({
                    "Message": "실패하였습니다.",
                    "type":3,
                    "Error_Message": "학번 혹은 포털 SW 개인정보 동의를 확인해주세요",
                    "Data": {
                        "user_id": "",
                        "name": "",
                        "department": "",
                        "grade": "",
                        "jwt_token": "",
                        "accept": "",
                    },
                })
            }
        } catch (error) {
            res.json({
                "Message": "실패하였습니다.",
                "type":4,
                "Error_Message": error
            })
        }
    },
    async adminList(req, res) {
        let jwt_token = req.cookies.admin;
        try {
            const permission = await jwtCerti(jwt_token);

            if (permission.LEVEL != 0 && permission.LEVEL != 1) throw "권한이 없습니다."

            const adminList = await adminDAO.adminAll();

            res.json({
                "Message": "성공하였습니다.",
                "Data" :adminList
            })
        } catch (error) {
            res.json({
                "Message": "실패하였습니다.",
                "Error_Message": error
            })
        }
    },
    async adminLevelUpdate(req,res){
        let jwt_token = req.cookies.admin;
        let {user_id, level} = req.body;
        let parameters = {
            "user_id":user_id,
            "level":level
        }
        try {
            const permission = await jwtCerti(jwt_token);

            if (permission.LEVEL != 0 && permission.LEVEL != 1) throw "권한이 없습니다."

            if(permission.LEVEL >= level) throw "사용자 레벨보다 낮게 설정하세요."

            const update_level = await adminDAO.adminLevelUpdate(parameters)
            res.json({
                "Message":"성공하였습니다."
            })
        } catch (error) {
            res.json({
                "Message":"실패하였습니다.",
                "Error_Message": error
            })
        }
    }
}