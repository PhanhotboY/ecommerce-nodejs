import express from 'express';
import { checkApiKey, checkPermission } from '../auth/checkApiKey';

const router = express.Router();

//check api key
router.use(checkApiKey);
//check api key's permission
router.use(checkPermission('0000'));

router.use('/', require('./auth'));

module.exports = router;
