import { Router } from 'express';
import { UserController } from '../../controllers/user.controller';

const userRouter = Router();

userRouter.post('/', UserController.newUser);

userRouter.get('/verify', UserController.verifyEmailToken);

module.exports = userRouter;
