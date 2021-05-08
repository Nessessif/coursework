import { Body, Controller, Get, Post, Render, Req, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { Response, Request } from 'express';
import { AnnouncementDto } from './dto/announcement.dto';
import { Sale } from './sales.shema';
import { Rent } from './rents.shema';
import { Announcement } from './structure/abstract-announcement';
import { RentAnnouncement } from './structure/rent-announcement';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';


import { diskStorage } from "multer";
import path, { extname } from "path";

@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) { }

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

  @Get('sales')
  @Render('allSales')
  renderAllSales(@Req() req) {
    return this.announcementService.renderAllSales(req.cookies['Authentication']);
  }

  @Post('add')
  async addAnnouncement(
    @Body() dto: AnnouncementDto,
    @Req() req,
    @Res() res: Response,
  ) {
    const status = await this.announcementService.add(dto, req.cookies['Authentication']);
    if (status === 'good') {
      return res.redirect('/');
    } else {
      req.flash('registerError', status);
      res.redirect('/');
    }
  }


  @Post('upload')
  @UseInterceptors(FileInterceptor('photos'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req,
    @Res() res: Response,
  ) {
    console.log(file);
  }

}


