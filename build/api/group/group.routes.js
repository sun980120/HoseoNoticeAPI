import { Router } from 'express';
import wrap from '../../modules/request.handler.js';
import { groupController as groupCtrl } from './group.controller.js';
import { studentVerifyJWT } from '../../middleware/auth.middleware.js';
export class GroupRoutes {
  path = '/group';
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    const router = Router();
    router.get('/my-group-list', studentVerifyJWT, wrap(groupCtrl.getMyGroup)).post('/add-group', studentVerifyJWT, wrap(groupCtrl.addGroup)).delete('/delete-my-group', studentVerifyJWT, wrap(groupCtrl.deleteMyGroup)).get('/all-group-list', studentVerifyJWT, wrap(groupCtrl.allGroup));
    this.router.use(this.path, router);
  }

}