import os from 'os';
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

mongoose.connection.on('open', () => {
  const numConnections = mongoose.connections.length;
  const numCores = os.cpus().length;
  const mem = process.memoryUsage().rss;
  const maxConnection = numCores * 5;

  if (numConnections === maxConnection) {
    console.log('Connection overload detected!');
  }

  console.log('Active connections::::', numConnections);
  console.log('Memory usage::::', mem / 1024 / 1024, 'MB');
});

export const mongodbInstance = Database.getInstance();
