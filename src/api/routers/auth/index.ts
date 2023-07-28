import express from 'express';

import { AuthController } from '../../controllers/auth.controller';

const authRouter = express.Router();

authRouter.post('/signup', AuthController.signUp);
authRouter.post('/signin', AuthController.signUp);
authRouter.post('/signout', AuthController.signUp);

module.exports = authRouter;
