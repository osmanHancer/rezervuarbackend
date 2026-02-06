import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModbusModule } from './modbus/modbus.module';
import { StatusModule } from './status/status.module';
import { ModbusData } from './entities/modbus-data.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '1234',
      database: process.env.DB_DATABASE || 'hurjet_rezervuar',
      entities: [ModbusData],
      synchronize: false, // Geliştirme için true, production'da false yapın
      logging: false,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    ModbusModule,
    StatusModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
