const env = process.env;

interface MongodbConfig {
  dbHost: string;
  dbPort: string;
  dbName: string;
  dbUser: string;
  dbPwd: string;
}

const mongodbConfigEnv: Record<'development' | 'production', MongodbConfig> = {
  development: {
    dbHost: env.DEV_DB_HOST as string,
    dbPort: env.DEV_DB_PORT as string,
    dbName: env.DEV_DB_NAME as string,
    dbUser: env.DEV_DB_USER as string,
    dbPwd: env.DEV_DB_PWD as string,
  },
  production: {
    dbHost: env.PRO_DB_HOST as string,
    dbPort: env.PRO_DB_PORT as string,
    dbName: env.PRO_DB_NAME as string,
    dbUser: env.DEV_DB_USER as string,
    dbPwd: env.DEV_DB_PWD as string,
  },
};

export const mongodbConfig: MongodbConfig =
  mongodbConfigEnv[env.NODE_ENV as 'development' | 'production'] || mongodbConfigEnv.development;
