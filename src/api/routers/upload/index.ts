import { Router } from 'express';

import { diskStorage } from '../../../configs/config.multer';
import { UploadController } from '../../controllers/upload.controller';
import { authenticationV2 } from '../../middlewares/authentication';

const uploadRouter = Router();

uploadRouter.use(authenticationV2);

uploadRouter.post(
  '/single',
  diskStorage.single('image'),
  UploadController.uploadImage
);

uploadRouter.post(
  '/multiple',
  diskStorage.array('images', 10),
  UploadController.uploadMultipleImages
);

module.exports = uploadRouter;
