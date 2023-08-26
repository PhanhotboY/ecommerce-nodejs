import { createClient } from 'redis';

const client = createClient();

class Redis {
  private static instance: Redis;

  constructor() {
    this.connect();
  }

  connect() {
    (async () => await client.connect())();
  }

  static async getInstance() {
    if (!this.instance) {
      this.instance = new Redis();
    }

    return this.instance;
  }
}

client.on('ready', async () => {
  const { id, laddr, flags, totMem, user, cmd, resp } = await client.clientInfo();

  console.log(
    `Redis info->>>id: ${id}, user: ${user},  laddr: ${laddr}, totMem: ${
      (totMem || 0) / 1024
    }, resp: ${resp}, flags: ${flags}, cmd: ${cmd}`
  );
});

export const redisInstance = Redis.getInstance();
export { client };
