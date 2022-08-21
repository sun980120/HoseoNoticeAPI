import { BadRequestException } from '../../common/exceptions/index.js';
import { resultJwt } from '../../modules/index.js';
import { userGroupDao } from './DAO/userGroup.dao.js';
import { groupDao } from './DAO/group.dao.js';

export const groupController = {
    async getMyGroup(req) {     // 사용자, 관리자 그룹 목록
        let jwt_token = req.header('jwt_token');
        let parameter = await resultJwt(jwt_token);
        const result = await userGroupDao.selectUserGroup(parameter).catch(e => {
            throw new BadRequestException(e);
        });
        return result;
    },
    async addGroup(req) {       // 사용자 그룹 추가
        let jwt_token = req.header('jwt_token');
        let parameter = await resultJwt(jwt_token);
        parameter.group_id = req.body.group_id;
        await userGroupDao.duplicateGroup(parameter).catch(e => {
            throw new BadRequestException(e);
        });
        const result = await userGroupDao.addGroup(parameter).catch(e => {
            throw new BadRequestException(e);
        });
        return result;
    },
    async deleteMyGroup(req) {  // 사용자 그룹 제거
        let jwt_token = req.header('jwt_token');
        let parameter = await resultJwt(jwt_token);
        parameter.group_id = req.body.group_id;
        const result = await userGroupDao.deleteMyGroup(parameter).catch(e => {
            throw new BadRequestException(e);
        });
        return result;
    },
    async allGroupList(req) {   // 사용자, 관리자 모든 그룹 목록
        let jwt_token = req.header('jwt_token');
        let parameter = await resultJwt(jwt_token);
        const db_data = await groupDao.allGroup().catch(e => {
            throw new BadRequestException(e);
        });
        let result = [];
        for (const i of db_data) {
            result.push({
                group_id: i.group_id,
                group_name: i.group_name,
                intro: i.intro,
                group_image: i.group_image
            });
        }
        return result;
    },
    async createGroup(req){     // 관리자 그룹 생성
        const { group_name, group_image, intro } = req.body;
        let jwt_token = req.header('jwt_token');
        let parameter = await resultJwt(jwt_token);
        parameter.group_name = group_name;
        parameter.group_image = group_image;
        parameter.intro = intro;
        try {
            await groupDao.nameDuplicate(parameter)
            const group_id =  await groupDao.createGroup(parameter)
            const result = await groupDao.adminGroupUser(group_id, parameter.user_id)
            return result;
        } catch (e) {
            throw new BadRequestException(e)
        }
    }
};