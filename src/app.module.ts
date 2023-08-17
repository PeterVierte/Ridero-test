import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { WinstonModule } from 'nest-winston';
import loggerConfig from '../logger.config';

@Module({
  imports: [FilesModule, WinstonModule.forRoot(loggerConfig)],
  controllers: [],
  providers: [],
})
export class AppModule {}
