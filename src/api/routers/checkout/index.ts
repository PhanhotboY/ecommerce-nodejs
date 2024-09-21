import { Router } from 'express';
import { authenticationV2 } from '../../middlewares/authentication';
import { CheckoutController } from '../../controllers/checkout.controller';

const checkoutRouter = Router();

checkoutRouter.use(authenticationV2);

checkoutRouter.post('/review', CheckoutController.reviewCheckout);
checkoutRouter.post('/', CheckoutController.createOrder);

module.exports = checkoutRouter;
