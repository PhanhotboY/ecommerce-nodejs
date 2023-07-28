import mongoose from 'mongoose';

import { mongodbConfig } from '../configs/config.mongodb';

const { dbHost, dbName, dbPort, dbUser, dbPwd } = mongodbConfig;

//Using Singleton pattern to init mongodb
class Database {
  static instance: Database;

  constructor(type: string = 'mongodb') {
    this.connect(type);
  }

  connect(type: string) {
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    mongoose
      .connect(`mongodb://${dbUser}:${dbPwd}@${dbHost}:${dbPort}/${dbName}`)
      .then(() => {
        console.log('-----Connection established successfully');
      })
      .catch((err) => {
        console.log('-----Fail to connect: ', err);
      });
  }

  disconnect(type: string) {
    mongoose.disconnect();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }

    return this.instance;
  }
}

export const mongodbInstance = Database.getInstance();
