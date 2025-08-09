import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TaskModule } from './modules/task/task.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import typeorm from './shared/configs/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      load: [typeorm],
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const typeOrmConfig = configService.get('typeorm');
        if (!typeOrmConfig) {
          throw new Error('TypeORM configuration not found!');
        }
        return typeOrmConfig;
      }
    }),
    TaskModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
