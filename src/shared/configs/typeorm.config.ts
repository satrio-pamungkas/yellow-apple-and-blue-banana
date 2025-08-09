import { DataSource, DataSourceOptions } from 'typeorm';
import { registerAs, ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
// import { MainSeeder } from '../seeds/seeder';
 
config();
 
const configService = new ConfigService();
 
const typeormConfig = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: ["dist/**/*.entity{.ts,.js}"],
  migrations: ["dist/migrations/*{.ts,.js}"],
  factories: ['src/factories/**/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false
};

export default registerAs('typeorm', () => typeormConfig);
export const connectionSource = new DataSource(typeormConfig as DataSourceOptions);