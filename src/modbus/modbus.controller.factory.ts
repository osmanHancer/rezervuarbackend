import { Body, Controller, Get, Param, Post, Type } from '@nestjs/common';
import { Channel } from '../common/channels';
import { CreateModbusDataDto } from './dto/create-modbus-data.dto';
import { ModbusService } from './modbus.service';

export function createModbusController(channel: Channel): Type<any> {
  @Controller(`api/${channel}/modbus`)
  class ChannelModbusController {
    constructor(private readonly modbusService: ModbusService) {}

    @Post('data')
    async create(@Body() createModbusDataDto: CreateModbusDataDto) {
      return await this.modbusService.create(createModbusDataDto);
    }

    @Get('data')
    async findAll() {
      return await this.modbusService.findAll();
    }

    @Get('data/port/:port')
    async findByPort(@Param('port') port: string) {
      return await this.modbusService.findByPort(port);
    }

    @Get('data/cycle/:cycle')
    async findByCycle(@Param('cycle') cycle: number) {
      return await this.modbusService.findByCycle(cycle);
    }

    @Get('data/cycle/:cycle/latest')
    async getLatestByCycle(@Param('cycle') cycle: number) {
      return await this.modbusService.getLatestByCycle(cycle);
    }

    @Get('data/cycle/:cycle/stats')
    async getStatsByCycle(@Param('cycle') cycle: number) {
      return await this.modbusService.getStatsByCycle(cycle);
    }
  }

  Object.defineProperty(ChannelModbusController, 'name', {
    value: `ModbusController${channel.toUpperCase()}`,
  });

  return ChannelModbusController;
}
