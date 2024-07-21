import express from 'express';
import { checkApiKey, checkPermission } from '../auth/checkApiKey';
import { pushLog2Discord } from '../middlewares/logger.middleware';

const router = express.Router();

router.use(pushLog2Discord);
//check api key

router.get('/check-status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Connect established successfully!',
  });
});

router.use(checkApiKey);
//check api key's permission
router.use(checkPermission('0000'));

router.use('/notifications', require('./notification'));
router.use('/discounts', require('./discount'));
router.use('/checkout', require('./checkout'));
router.use('/products', require('./product'));
router.use('/comments', require('./comment'));
router.use('/profile', require('./profile'));
router.use('/upload', require('./upload'));
router.use('/cart', require('./cart'));
router.use('/rbac', require('./rbac'));
router.use('/', require('./auth'));

module.exports = router;
