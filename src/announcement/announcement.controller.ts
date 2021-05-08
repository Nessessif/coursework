import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { Response, Request } from 'express';
import { AnnouncementDto } from './dto/announcement.dto';
import { Sale } from './sales.shema';
import { Rent } from './rents.shema';
import { Announcement } from './structure/abstract-announcement';
import { RentAnnouncement } from './structure/rent-announcement';

@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get('sale')
  @Render('sale')
  renderSale(@Req() req, @Res() res: Response) {
    if (!req.cookies['Authentication']) {
      res.redirect('/');
    }
    return this.announcementService.renderSale(req.cookies['Authentication']);
  }

  @Get('rent')
  @Render('rent')
  renderRent(@Req() req, @Res() res: Response) {
    if (!req.cookies['Authentication']) {
      res.redirect('/');
    }
    return this.announcementService.renderRent(req.cookies['Authentication']);
  }

  @Post('add')
  async addAnnouncement(
    @Body() dto: AnnouncementDto,
    @Req() req,
    @Res() res: Response,
  ) {
    const status = await this.announcementService.add(dto);
    if (status === 'good') {
      return res.redirect('/');
    } else {
      req.flash('registerError', status);
      res.redirect('/');
    }
  }
}
