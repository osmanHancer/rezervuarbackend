import { Controller, Get, Type } from '@nestjs/common';
import { Channel } from '../common/channels';
import { StatusService } from './status.service';

export function createStatusController(channel: Channel): Type<any> {
  @Controller(`api/${channel}/status`)
  class ChannelStatusController {
    constructor(private readonly statusService: StatusService) {}

    @Get()
    async getCurrentStatus() {
      return await this.statusService.getLatestData(channel);
    }

    @Get('json')
    async getStatusJson() {
      return await this.statusService.getLatestData(channel);
    }
  }

  Object.defineProperty(ChannelStatusController, 'name', {
    value: `StatusController${channel.toUpperCase()}`,
  });

  return ChannelStatusController;
}
