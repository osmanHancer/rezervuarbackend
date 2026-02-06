import { Controller, Get } from '@nestjs/common';
import { StatusService } from './status.service';

@Controller('api/status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  async getCurrentStatus() {
    return await this.statusService.getLatestData();
  }

  @Get('json')
  async getStatusJson() {
    return await this.statusService.getLatestData();
  }
}

