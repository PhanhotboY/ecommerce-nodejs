import { Router } from 'express';

import { authenticationV2 } from '../../middlewares/authentication';
import { ProductController } from '../../controllers/product.controller';

const productRouter = Router();

productRouter.get('/search/:search', ProductController.searchProducts);
productRouter.get('/details/:productId', ProductController.getProductDetails);
productRouter.get('/', ProductController.getAllProducts);

// Require authentication routers
productRouter.use(authenticationV2);

productRouter.delete('/:productId', ProductController.destroyProduct);
productRouter.patch('/:productId', ProductController.patchProduct);
productRouter.get('/published', ProductController.getAllPublished);
productRouter.get('/deleted', ProductController.getAllDeteled);
productRouter.get('/draft', ProductController.getAllDrafts);
productRouter.get('/:productId', ProductController.getProductDetailsForShop);
productRouter.post('/', ProductController.createProduct);

module.exports = productRouter;
