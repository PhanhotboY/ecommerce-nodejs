import os from 'os';
import mongoose from 'mongoose';

import { mongodbConfig } from '../configs/config.mongodb';
import { InternalServerError } from '../api/core/errors';

const { dbHost, dbName, dbPort, dbUser, dbPwd } = mongodbConfig;

//Using Singleton pattern to init mongodb
class MongoDB {
  static instance: MongoDB;
  private retryCount = 0;

  constructor(type: string = 'mongodb') {
    this.connect(type);
    this.handleConnectionEvent();
  }

  async connect(type: string) {
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    console.log('Retrying to connect to MongoDB...', this.retryCount);
    this.retryCount++;
    await mongoose
      .connect(`mongodb://${dbUser}:${dbPwd}@${dbHost}:${dbPort}/${dbName}`, {
        serverSelectionTimeoutMS: 5000,
      })
      .catch(() => {});
  }

  disconnect(type: string) {
    mongoose.disconnect();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new MongoDB();
    }

    return this.instance;
  }

  handleConnectionEvent() {
    // @ts-ignore
    mongoose.connection.on('disconnected', async () => {
      console.log('MongoDB disconnected');
      if (this.retryCount > 10) {
        throw new InternalServerError('Error connecting to MongoDB');
      }
      await this.connect('mongodb');
    });

    // @ts-ignore
    mongoose.connection.on('connecting', () => {
      console.log('Connecting to MongoDB...');
    });

    // @ts-ignore
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
      this.retryCount = 0;
      this.logStatus();
    });

    // @ts-ignore
    mongoose.connection.on('close', () => {
      console.log('MongoDB connection closed');
      this.retryCount = 0;
    });
  }

  logStatus() {
    const numConnections = mongoose.connections.length;
    const numCores = os.cpus().length;
    const mem = process.memoryUsage().rss;
    const maxConnection = numCores * 5;

    if (numConnections === maxConnection) {
      console.log('Connection overload detected!');
    }

    console.log('Active connections::::', numConnections);
    console.log('Memory usage::::', mem / 1024 / 1024, 'MB');
  }
}

export const mongodbInstance = MongoDB.getInstance();
