'use strict';

import { noticeDAO } from './DAO/notice.dao.js';
import dayjs from 'dayjs';
import path from 'path';
import fs from 'fs';

import {
    jwtMiddleware,
} from '../../modules/index.js';
import { BadRequestException } from '../../common/exceptions/index.js';

// import { captureRejectionSymbol } from 'winston-daily-rotate-file'

export const noticeCtrl = {
    async noticeMainApp(req, res, next) {
        const notice_data = await noticeDAO.noticeAll().catch(e => {
            throw new BadRequestException(e);
        });
        return notice_data;
    },
    async noticeDetailApp(req, res, next) {
        let parameters = req.body.notice_id;
        const notice_detail = await noticeDAO.noticeDetail(parameters).catch(e => {
            throw new BadRequestException(e);
        });

        let noticedetail_all = [];
        for (const element of notice_detail) {
            const data = await noticeDAO.noticeDetailFile(element.notice_id).catch(e => {
                throw new BadRequestException(e);
            });
            element['file'] = data[0]['file'];
            noticedetail_all.push(element);
        }
        return noticedetail_all;
    },
    async noticeDetailweb(req, res, next) {
        let parameters = req.query;
        const notice_detail = await noticeDAO.noticeDetail(parameters).catch(e => {
            throw new BadRequestException(e);
        });

        let noticedetail_all = [];
        for (const element of notice_detail) {
            const data = await noticeDAO.noticeDetailFile(element.notice_id).catch(e => {
                throw new BadRequestException(e);
            });
            element['file'] = data[0]['file'];
            noticedetail_all.push(element);
        }
        return noticedetail_all;
    },
    async noticeMain(req, res, next) {
        const notice_data = await noticeDAO.noticeAll().catch(e => {
            throw new BadRequestException(e);
        });
        return notice_data;
    },
    async noticeWatch(req, res, next) {
        let parameters = req.query.notice_id;
        const notice_data = await noticeDAO.noticeWatch(parameters).catch(e => {
            throw new BadRequestException(e);
        });
        return notice_data;
    },
    async noticeWrite(req, res, next) {
        let jwt_token = req.cookies.admin;
        let { title, content, priority, program_id } = req.body;
        let files = req.files;
        let datetime = new dayjs().format('YYYY-MM-DD HH:mm:ss');

        let parameters = {
            'title': title,
            // "content": escapeHtml(content),
            //html형식 이상해서 변경함 02.23.김찬희
            'content': content,
            'priority': priority,
            'create_time': datetime,
            'program_id': '',
        };
        if (program_id !== '') parameters.program_id = program_id;
        const permission = await jwtMiddleware.jwtCerti(jwt_token).catch(e => {
            throw new BadRequestException(e);
        });
        parameters.user_id = permission.STUDENT_ID;
        if (permission.LEVEL != 0 && permission.LEVEL != 1) throw new BadRequestException('권한이 없습니다.');

        const notice_write = await noticeDAO.noticeWrite(parameters).catch(e => {
            throw new BadRequestException(e);
        });
        const notice_id = await noticeDAO.select_notice_id(parameters).catch(e => {
            throw new BadRequestException(e);
        });
        for (var key in files) {
            let file_parameters = {
                'notice_id': notice_id,
                'file_path': files[key].destination,
                'file_orgn_name': files[key].originalname,
                'file_size': files[key].size,
                'file_extension': files[key].mimetype,
                'file_create_time': datetime,
            };
            await noticeDAO.insert_notice_file(file_parameters).catch(e => {
                throw new BadRequestException(e);
            });
        }
        return true;
    },
    async noticeDelete(req, res, next) {
        let jwt_token = req.cookies.admin;
        let parameters = { 'notice_id': req.body.notice_id };
        const permission = await jwtMiddleware.jwtCerti(jwt_token);
        if (permission.LEVEL != 0 && permission.LEVEL != 1) {
            throw new BadRequestException('권한이 없습니다.');
        }
        const notice_delete = await noticeDAO.noticeDelete(parameters).catch(e => {
            throw new BadRequestException(e);
        });
        return notice_delete;
    },
    downloadFile(req, res, next) {
        console.log(req.query.file_name);
        const file = path.join(__dirname, `/../../public/upload/${req.query.file_name}`);
        const filestream = fs.createReadStream(file);
        filestream.pipe(res);
    },
};