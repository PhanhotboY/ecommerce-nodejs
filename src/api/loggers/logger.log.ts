import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { v4 as uuid } from 'uuid';

interface LogParams {
  context: string;
  requestId?: string;
  metadata?: any;
}

class Logger {
  private logger;

  constructor() {
    const formatPrint = format.printf(({ level, message, timestamp, requestId, context, metadata }) => {
      return `${timestamp} [${level}] [${requestId}] ["${context}"] ${message} ${
        metadata ? JSON.stringify(metadata) : ''
      }`;
    });

    this.logger = createLogger({
      format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatPrint),
      transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
          dirname: 'src/logs',
          filename: 'application-%DATE%.info.log',
          datePattern: 'YYYY-MM-DD-HH:mm',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatPrint),
          level: 'info',
        }),
        new transports.DailyRotateFile({
          dirname: 'src/logs',
          filename: 'application-%DATE%.error.log',
          zippedArchive: true,
          datePattern: 'YYYY-MM-DD-HH:mm',
          maxSize: '20m',
          maxFiles: '14d',
          format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatPrint),
          level: 'error',
        }),
      ],
    });
  }

  commonParams(params: LogParams) {
    return {
      context: params.context,
      requestId: params.requestId || uuid(),
      metadata: params.metadata || {},
    };
  }

  info(message: string, params: LogParams) {
    const infoObject = Object.assign({ message }, this.commonParams(params));

    return this.logger.info(infoObject);
  }

  error(message: string, params: LogParams) {
    const errorObject = Object.assign({ message }, this.commonParams(params));

    return this.logger.error(errorObject);
  }
}

export const logger = new Logger();
