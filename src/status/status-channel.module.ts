import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../common/channels';
import { ModbusData } from '../entities/modbus-data.entity';
import { createStatusController } from './status.controller.factory';
import { StatusService } from './status.service';

@Module({})
export class StatusChannelModule {
  static forChannel(channel: Channel): DynamicModule {
    return {
      module: StatusChannelModule,
      controllers: [createStatusController(channel)],
      imports: [TypeOrmModule.forFeature([ModbusData], channel)],
      providers: [
        {
          provide: StatusService,
          useFactory: (repo: Repository<ModbusData>) => new StatusService(repo),
          inject: [getRepositoryToken(ModbusData, channel)],
        },
      ],
      exports: [StatusService],
    };
  }
}
