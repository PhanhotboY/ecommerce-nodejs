import { Router } from 'express';

import { ProfileController } from '../../controllers/profile.controller';
import { grantAccess } from '../../middlewares/rbac.middleware';

const profileRouter = Router();

profileRouter.get(
  '/viewAny',
  grantAccess('readAny', 'profile'),
  ProfileController.getProfiles
);

profileRouter.get(
  '/viewOwn',
  grantAccess('readOwn', 'profile'),
  ProfileController.getProfile
);

module.exports = profileRouter;
