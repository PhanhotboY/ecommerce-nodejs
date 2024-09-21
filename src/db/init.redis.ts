import { createClient, RedisClientType } from 'redis';

import { REDIS } from '../api/constants';
import { InternalServerError } from '../api/core/errors';

const client = createClient({
  password: process.env.DEV_REDIS_PASSWORD,
  socket: {
    host: process.env.DEV_REDIS_HOST,
    port: Number(process.env.DEV_REDIS_PORT),
  },
});

class Redis {
  private static instance: Redis;
  private client = client;
  private retryTimmer: NodeJS.Timeout | null = null;

  constructor() {
    this.connect();
  }

  connect() {
    (async () => await client.connect())();
    this.handleConnectionEvent();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Redis();
    }

    return this.instance;
  }

  getClient() {
    return this.client;
  }

  handleConnectionEvent() {
    // @ts-ignore
    this.client.on(REDIS.EVENTS.ERROR, () => {
      console.log('Error in Redis connection');
      this.startRetryTimmer();
    });

    // @ts-ignore
    this.client.on(REDIS.EVENTS.END, () => {
      console.log('Redis connection ended');
      this.startRetryTimmer();
    });

    // @ts-ignore
    this.client.on(REDIS.EVENTS.CONNECT, () => {
      console.log('Redis connected');

      if (this.retryTimmer) {
        clearTimeout(this.retryTimmer);
      }
    });

    // @ts-ignore
    this.client.on(REDIS.EVENTS.RECONNECTING, () => {
      console.log('Redis reconnecting');
    });

    // @ts-ignore
    this.client.on(REDIS.EVENTS.READY, async () => {
      const { id, laddr, flags, totMem, user, cmd, resp } =
        await this.client.clientInfo();

      if (this.retryTimmer) clearTimeout(this.retryTimmer);

      console.log(
        `Redis info->>>id: ${id}, user: ${user},  laddr: ${laddr}, totMem: ${
          (totMem || 0) / 1024
        }, resp: ${resp}, flags: ${flags}, cmd: ${cmd}`
      );
    });
  }

  startRetryTimmer() {
    if (this.retryTimmer) clearTimeout(this.retryTimmer);

    this.retryTimmer = setTimeout(() => {
      throw new InternalServerError(REDIS.RETRY_MESSAGE.VN);
    }, REDIS.RETRY_TIMEOUT);
  }
}

export const redisInstance = Redis.getInstance();
