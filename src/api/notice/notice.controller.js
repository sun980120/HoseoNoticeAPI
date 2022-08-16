import { noticeDao } from './DAO/notice.dao.js';
import { BadRequestException } from '../../common/exceptions/index.js';
import path from 'path';
import fs from 'fs';
import dayjs from 'dayjs';
import { sendAndPush } from './util.js';
import { resultJwt } from '../../modules/index.js';
import { groupDao } from '../group/DAO/group.dao.js';

export const noticeCtrl = {
    async allGroupNoticeApp(req) {
        let jwt_token = req.header('jwt_token');
        let parameter = await resultJwt(jwt_token);
        parameter.group_id = req.query.group_id;
        await groupDao.adminGroupCheck(parameter).catch(e=>{throw new BadRequestException(e)})

        const db_data = await noticeDao.allGroupNotice(parameter).catch(e => {
            throw new BadRequestException(e);
        });
        let result = [];
        for (const i of db_data) {
            let file_count = await noticeDao.selectFile(i.notice_id).catch(e=>{
                throw new BadRequestException(e)
            })
            result.push({
                notice_id: i.notice_id,
                title: i.title,
                create_time: i.create_time,
                file_count: file_count // 파일의 갯수
            });
        }
        return result;
    },
    async detailNotice(req){
        let jwt_token = req.header('jwt_token');
        let parameter = await resultJwt(jwt_token);
        parameter.notice_id = req.query.notice_id;

        let result = await noticeDao.detailNotice(parameter).catch(e=>{
            throw new BadRequestException(e)
        })
        let filename = await noticeDao.detailNoticeFile(parameter).catch(e=>{
            throw new BadRequestException(e)
        })
        let file_name = []
        for(let i of filename){
            file_name.push(i.file_name)
        }
        result.file_name = file_name
        return result
    },
    async downloadFile(req, res) {
        let parameter = {
            'file_name': req.query.file_name
        };
        const file = path.join(__dirname, `/../../public/upload/${parameter.file_name}`);
        const filestream = fs.createReadStream(file);
        filestream.pipe(res);
    },
    async writeNotice(req) {
        let jwt_token = req.header('jwt_token');
        let parameter = await resultJwt(jwt_token);
        let create_time = new dayjs().format('YYYY-MM-DD HH:mm:ss');
        const {title, content, group_id} = req.body;
        parameter = {
            title, content, create_time, group_id
        }
        await groupDao.adminGroupCheck(parameter).catch(e=>{throw new BadRequestException(e)})
        console.log('파일업로드를 완료했습니다.')
        parameter.notice_id = await noticeDao.createNotice(parameter).catch(e=>{
            throw new BadRequestException(e)
        })
        const result = await sendAndPush(parameter, req.files)
        return result;
    },
    async editNotice(req){
        let create_time = new dayjs().format('YYYY-MM-DD HH:mm:ss');
        let jwt_token = req.header('jwt_token');
        let parameter = await resultJwt(jwt_token);
        const {notice_id, title, content, group_id} = req.body;
        parameter = {
            notice_id, title, content, create_time, group_id
        }
        await groupDao.adminGroupCheck(parameter).catch(e=>{throw new BadRequestException(e)})
        console.log('파일업로드를 완료했습니다.')
        await noticeDao.deletefile(parameter).catch(e=>{
            throw new BadRequestException(e)
        })
        await noticeDao.editNotice(parameter).catch(e=>{
            throw new BadRequestException(e)
        })
        const result = await sendAndPush(parameter, req.files)
        return result;
    },
    async deleteNotice(req){
        let jwt_token = req.header('jwt_token');
        let parameter = await resultJwt(jwt_token);
        const {notice_id, group_id} = req.body;
        parameter = {
            notice_id, group_id
        }
        await groupDao.adminGroupCheck(parameter).catch(e=>{throw new BadRequestException(e)})
        await noticeDao.deletefile(parameter).catch(e=>{
            throw new BadRequestException(e)
        })
        const result = await noticeDao.deleteNotice(parameter).catch(e=>{
            throw new BadRequestException(e)
        })
        return result;
    }
};