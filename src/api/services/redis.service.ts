import { APP } from '../constants';
import { redisInstance } from '../../db/init.redis';
import { reserveInventory } from './inventory.service';

const client = redisInstance.getClient();

const acquireLock = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const lockKey = `${APP.LOCK_PREFIX}${productId}`;

  for (let times = 0; times < APP.ORDER_RETRY_TIMES; times++) {
    const nxResult = await client.setNX(lockKey, 'I am being used!');
    console.log('set nx result:::', nxResult);
    if (nxResult) {
      try {
        const reserve = await reserveInventory(userId, productId, quantity);
        console.log('reservation result::::', reserve);

        const exp = await client.pExpire(lockKey, APP.ORDER_LOCK_EXPIRED_TIME);
        console.log('setted expired time:::', exp);

        return reserve.modifiedCount ? lockKey : null;
      } catch (err) {
        const exp = await client.pExpire(lockKey, APP.ORDER_LOCK_EXPIRED_TIME);
        console.log('setted expired time:::', exp);

        throw err;
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock: string) => {
  return await client.del(keyLock);
};

export { acquireLock, releaseLock };
