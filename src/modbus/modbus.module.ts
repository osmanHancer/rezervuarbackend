import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModbusController } from './modbus.controller';
import { ModbusService } from './modbus.service';
import { ValveStateService } from './valve-state.service';
import { ModbusData } from '../entities/modbus-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ModbusData])],
  controllers: [ModbusController],
  providers: [ModbusService, ValveStateService],
  exports: [ModbusService, ValveStateService],
})
export class ModbusModule {}

