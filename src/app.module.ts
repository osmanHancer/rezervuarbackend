import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, resolve } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CHANNELS } from './common/channels';
import { getDatabaseConfig } from './database/database.config';
import { ModbusChannelModule } from './modbus/modbus-channel.module';
import { StatusChannelModule } from './status/status-channel.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [resolve(process.cwd(), '.env')],
    }),
    ...CHANNELS.map((channel) =>
      TypeOrmModule.forRootAsync({
        name: channel,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) =>
          getDatabaseConfig(channel, config),
        inject: [ConfigService],
      }),
    ),
    ...CHANNELS.map((channel) => ModbusChannelModule.forChannel(channel)),
    ...CHANNELS.map((channel) => StatusChannelModule.forChannel(channel)),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
      exclude: ['/api*', '/online'],
      serveStaticOptions: {
        index: false,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
