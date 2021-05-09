import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  async render(@Req() req) {
    return await this.appService.render(req.cookies['Authentication']);
  }
}
