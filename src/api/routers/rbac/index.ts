import { Router } from 'express';

const rbacRouter = Router();

rbacRouter.post('/resources');
rbacRouter.get('/resources');

rbacRouter.post('/roles');
rbacRouter.get('/roles');

module.exports = rbacRouter;
