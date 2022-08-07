import { BadRequestException } from '../../common/exceptions/index.js';
import { resultJwt } from '../../modules/index.js';
import { userGroupDao } from './DAO/userGroup.dao.js';
import { groupDao } from './DAO/group.dao.js';
export const groupController = {
  async getMyGroup(req) {
    let jwt_token = req.header('jwt_token');
    let parameter = await resultJwt(jwt_token);
    const result = await userGroupDao.selectUserGroup(parameter).catch(e => {
      throw new BadRequestException(e);
    });
    return result;
  },

  async addGroup(req) {
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

  async deleteMyGroup(req) {
    let jwt_token = req.header('jwt_token');
    let parameter = await resultJwt(jwt_token);
    parameter.group_id = req.body.group_id;
    const result = await userGroupDao.deleteMyGroup(parameter).catch(e => {
      throw new BadRequestException(e);
    });
    return result;
  },

  async allGroup(req) {
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
  }

};