import { Router } from 'express';
import { CartController } from '../../controllers/cart.controller';
import { authenticationV2 } from '../../middlewares/authentication';
import '../../services/checkout.service';
const cartRouter = Router();

/**
 * GET /cart/:userId
 * POST /cart/update
 * POST /cart
 */
cartRouter.use(authenticationV2);

cartRouter.get('/', CartController.getCartDetails);
cartRouter.post('/update', CartController.updateCart);
cartRouter.post('/', CartController.addToCart);

module.exports = cartRouter;
