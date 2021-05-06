import { Controller, Get, Render, Req } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';

@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get('sale')
  @Render('sale')
  renderSale(@Req() req) {
    return this.announcementService.renderSale(req.cookies['Authentication']);
  }

  @Get('rent')
  @Render('rent')
  renderRent(@Req() req) {
    return this.announcementService.renderRent(req.cookies['Authentication']);
  }
}
