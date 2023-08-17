import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

const loggerConfig: WinstonModuleOptions = {
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/all-logs.log',
    }),
  ],
};

export default loggerConfig;
