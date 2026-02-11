import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';
import { AppService } from './app.service';

@Controller('rezervuar')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('api/health')
  getHello(): string {
    return this.appService.getHello();
  }

  // Online sayfası
  @Get('online')
  getOnline(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  }
}
