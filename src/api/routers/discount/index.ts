import express from 'express';
import { authenticationV2 } from '../../middlewares/authentication';
import { DiscountController } from '../../controllers/discount.controller';

const discountRouter = express.Router();

// api/v1/discounts/:code/products
discountRouter.get('/:code/products', DiscountController.getApplicableProducts);
// api/v1/discounts?shopId=&limit=50&page=1
discountRouter.get('/', DiscountController.getAllDiscountCodes);

discountRouter.use(authenticationV2);

discountRouter.post('/:code', DiscountController.useDiscount);
discountRouter.patch('/:code', DiscountController.patchDiscount);
discountRouter.post('/', DiscountController.createDiscount);
discountRouter.delete('/:code', DiscountController.deleteDiscount);

module.exports = discountRouter;
