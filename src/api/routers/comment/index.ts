import { Router } from 'express';

import { CommentController } from '../../controllers/comment.controller';
import { authenticationV2 } from '../../middlewares/authentication';
import { checkApiKey, checkPermission } from '../../auth/checkApiKey';

const commentRouter = Router();

commentRouter.use(checkApiKey);
commentRouter.use(checkPermission('0000'));

commentRouter.get('/:commentId', CommentController.getCommentThread);

// require authentication for the following routes
commentRouter.use(authenticationV2);

commentRouter.post('/', CommentController.createComment);
commentRouter.delete('/:commentId', CommentController.deleteComment);
// commentRouter.get("/", )

module.exports = commentRouter;
