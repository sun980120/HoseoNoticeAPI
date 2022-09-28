import { BadRequestException } from '../../common/exceptions/index.js';
import { resultJwt } from '../../modules/index.js';
import { userGroupDao } from './DAO/userGroup.dao.js';
import { groupDao } from './DAO/group.dao.js';

export const groupController = {
    /**
     * 사용자/ 관리자 그룹 목록
     * @header {jwt_token} req.header
     * @returns 
     */
    async getMyGroup(req) {     // 사용자, 관리자 그룹 목록
        let jwt_token = req.header('jwt_token');
        let parameter = await resultJwt(jwt_token);
        let result;
        if(req.path == '/admin-group-list'){
            result = await userGroupDao.selectAdminGroup(parameter).catch(e => {
                throw new BadRequestException(e);
            });
        } else {
            result = await userGroupDao.selectUserGroup(parameter).catch(e => {
                throw new BadRequestException(e);
            });
        }
        
        return result;
    },
    /**
     * 사용자 그룹 추가
     * @header {jwt_token} req.header
     * @body {group_id} req.body
     * @returns 
     */
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
    /**
     * 사용자 그룹 제거
     * @header {jwt_token} req.header
     * @body {group_id} req.body
     * @returns 
     */
    async deleteMyGroup(req) {
        let jwt_token = req.header('jwt_token');
        let parameter = await resultJwt(jwt_token);
        parameter.group_id = req.body.group_id;
        const result = await userGroupDao.deleteMyGroup(parameter).catch(e => {
            throw new BadRequestException(e);
        });
        return result;
    },
    /**
     * 사용자/ 관리자 모든 그룹 목록
     * @header {jwt_token} req.header 
     * @returns 
     */
    async allGroupList(req) {
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
    /**
     * 관리자 그룹 생성
     * @body {group_name, group_image, intro} req.body
     * @returns 
     */
    async createGroup(req){     // 관리자 그룹 생성
        const { group_name, group_image, intro } = req.body;
        let jwt_token = req.header('jwt_token');
        let parameter = await resultJwt(jwt_token);
        parameter.group_name = group_name;
        parameter.group_image = group_image;
        parameter.intro = intro;
        try {
            if(parameter.user_level !== 0 ) throw "최고 관리자만 생성가능합니다."
            await groupDao.nameDuplicate(parameter)
            const group_id =  await groupDao.createGroup(parameter)
            const result = await groupDao.adminGroupUser(group_id, parameter.user_id)
            return result;
        } catch (e) {
            throw new BadRequestException(e)
        }
    },
    /**
     * 관리자 그룹 신규 요청
     * @header {jwt_token} req.header
     * @body {group_id} req.body
     * @returns 
     */
    async adminGroupCall(req){
        const { group_id } = req.body;
        let jwt_token = req.header('jwt_token');
        let parameter = await resultJwt(jwt_token);
        parameter.group_id = group_id;
        try {
            await groupDao.duplicateGroup(parameter)
            return await groupDao.adminGroupCall(parameter)
        } catch (e) {
            throw new BadRequestException(e)
        }
    },
    /**
     * 관리자 그룹 권한 부여
     * @header {jwt_token} req.header
     * @body {admin_group_id} req.body
     * @returns 
     */
    async adminGroupAccept(req){
        const { admin_group_id } = req.body;
        let jwt_token = req.header('jwt_token')
        let parameter = await resultJwt(jwt_token);
        try {
            if(parameter.user_level !== 0) throw "최고 관리자만 접근 가능합니다."
            return await groupDao.adminGroupAccept(admin_group_id)
        } catch (e) {
            console.log(e)
            throw new BadRequestException(e)
        }
    },
    /**
     * 관리자 구릅 신청 리스트
     * @header {jwt_token} req.header
     * @returns 
     */
    async adminGroupCallList(req){
        let jwt_token = req.header('jwt_token')
        let parameter = await resultJwt(jwt_token)
        try {
            if(parameter.user_level !==0 ) throw "최고 관리자만 접근 가능합니다."
            const result = await groupDao.adminGroupCallList()
            return result
        } catch (e) {
            throw new BadRequestException(e)
        }
    }
};