import express from 'express';
import { authenticationV2 } from '../../middlewares/authentication';
import { DiscountController } from '../../controllers/discount.controller';

const discountRouter = express.Router();

discountRouter.get('/', DiscountController.getApplicableProducts);

discountRouter.use(authenticationV2);

discountRouter.post('/', DiscountController.createDiscount);

module.exports = discountRouter;
