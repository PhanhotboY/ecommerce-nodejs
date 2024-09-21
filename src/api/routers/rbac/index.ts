import { Router } from 'express';
import { RBACController } from '../../controllers/rbac.controller';

const rbacRouter = Router();

rbacRouter.post('/resources', RBACController.createResource);
rbacRouter.get('/resources', RBACController.getResources);

rbacRouter.post('/roles', RBACController.createRole);
rbacRouter.get('/roles/:slug/permissions', RBACController.getPermissions);
rbacRouter.get('/roles/:slug', RBACController.getRole);
rbacRouter.get('/roles', RBACController.getRoles);

module.exports = rbacRouter;
