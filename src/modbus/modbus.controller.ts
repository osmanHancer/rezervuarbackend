import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ModbusService } from './modbus.service';
import { ValveStateService } from './valve-state.service';
import { CreateModbusDataDto } from './dto/create-modbus-data.dto';

@Controller('api/modbus')
export class ModbusController {
  constructor(
    private readonly modbusService: ModbusService,
    private readonly valveStateService: ValveStateService,
  ) {}

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

  @Post('valve-control')
  async setValvePosition(@Body() body: { position: number }) {
    this.valveStateService.setValvePosition(body.position);
    return {
      success: true,
      position: body.position,
      message: `Valve position ${body.position} olarak ayarlandı`,
    };
  }

  @Get('valve-state')
  async getValveState() {
    return this.valveStateService.getValvePosition();
  }
}

