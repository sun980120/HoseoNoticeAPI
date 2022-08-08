import { noticeDao } from './DAO/notice.dao.js';
import { BadRequestException } from '../../common/exceptions/index.js';
import path from 'path';
import fs from 'fs';
import dayjs from 'dayjs';

export const noticeCtrl = {
    async allGroupNoticeApp(req) {
        let parameter = {
            'group_id': req.body.group_id
        };
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
                file_count: file_count //파일다운횟수 ???
            });
        }
        return result;
    },
    async detailNotice(req){
        console.log(req.params)
        let parameter = {
            'group_id': req.body.group_id,
            'notice_id': req.query.notice_id
        };
        let result = await noticeDao.detailNotice(parameter).catch(e=>{
            throw new BadRequestException(e)
        })
        let filename = await noticeDao.detailNoticeFile(parameter).catch(e=>{
            throw new BadRequestException(e)
        })
        console.log(result)
        let file_name = []
        for(var i of filename){
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
        // await noticeDao.downloadCount(parameter).catch(e=>{
        //     throw new BadRequestException(e)
        // })
        filestream.pipe(res);
    },
    async writeNotice(req) {
        console.log('파일업로드를 완료했습니다.')
        let create_time = new dayjs().format('YYYY-MM-DD HH:mm:ss');
        const {title, content, group_id} = req.body;
        let parameter = {
            title, content, create_time, group_id
        }
        parameter.notice_id = await noticeDao.createNotice(parameter).catch(e=>{
            throw new BadRequestException(e)
        })
        for(var i of req.files){
            await noticeDao.insertFile(parameter, i).catch(e=>{
                throw new BadRequestException(e)
            })
        }
        return '공지사항 추가 완료했습니다'
    }
};