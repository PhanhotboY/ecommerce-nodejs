import { Router } from 'express';

import { authenticationV2 } from '../../middlewares/authentication';
import { ProductController } from '../../controllers/product.controller';

const productRouter = Router();

productRouter.get('/search/:search', ProductController.searchProducts);
productRouter.get('/', ProductController.searchProducts);

// Require authentication routers
productRouter.use(authenticationV2);

productRouter.patch('/:productId', ProductController.patchProduct);
productRouter.get('/draft', ProductController.getAllDrafts);
productRouter.get('/published', ProductController.getAllProducts);
productRouter.post('/', ProductController.createProduct);

module.exports = productRouter;
