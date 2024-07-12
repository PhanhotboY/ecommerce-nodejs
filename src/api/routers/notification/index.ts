import { Router } from 'express';

import { NotificationController } from '../../controllers/notification.controller';
import { authenticationV2 } from '../../middlewares/authentication';

const notiRouter = Router();

notiRouter.use(authenticationV2);

notiRouter.get('/', NotificationController.getNotifications);

module.exports = notiRouter;
