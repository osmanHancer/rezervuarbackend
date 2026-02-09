import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('api/health')
  getHello(): string {
    return this.appService.getHello();
  }

  // Ana rezervuar sayfası
  @Get()
  getIndex(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  }

  // Monitoring sayfası
  @Get('monitoring')
  getMonitoring(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'monitoring.html'));
  }
}
