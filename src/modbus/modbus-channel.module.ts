import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../common/channels';
import { ModbusData } from '../entities/modbus-data.entity';
import { createModbusController } from './modbus.controller.factory';
import { ModbusService } from './modbus.service';

@Module({})
export class ModbusChannelModule {
  static forChannel(channel: Channel): DynamicModule {
    return {
      module: ModbusChannelModule,
      imports: [TypeOrmModule.forFeature([ModbusData], channel)],
      controllers: [createModbusController(channel)],
      providers: [
        {
          provide: ModbusService,
          useFactory: (repo: Repository<ModbusData>) => new ModbusService(repo),
          inject: [getRepositoryToken(ModbusData, channel)],
        },
      ],
      exports: [ModbusService],
    };
  }
}
