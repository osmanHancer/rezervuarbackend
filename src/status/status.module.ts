import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { ModbusData } from '../entities/modbus-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ModbusData])],
  controllers: [StatusController],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}

