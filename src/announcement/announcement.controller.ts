import { Body, Controller, Get, Post, Render, Req, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { Response, Request } from 'express';
import { AnnouncementDto } from './dto/announcement.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';



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
    return this.announcementService.renderAllSales(
      req.cookies['Authentication'],
    );
  }

  @Post('getSales')
  async getMoreSales(@Req() req, @Res() res: Response) {
    res
      .status(200)
      .json(
        await this.announcementService.getMoreSales(
          req.body.skip,
          req.body.count,
        ),
      );
  }

  @Get('rents')
  @Render('allRents')
  renderAllRents(@Req() req) {
    return this.announcementService.renderAllRents(
      req.cookies['Authentication'],
    );
  }

  @Post('getRents')
  async getMoreRents(@Req() req, @Res() res: Response) {
    res
      .status(200)
      .json(
        await this.announcementService.getMoreRents(
          req.body.skip,
          req.body.count,
        ),
      );
  }



  @Post('add')
  @UseInterceptors(FilesInterceptor('photos', 10, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const fileExtName = extname(file.originalname);
        const randomName = Array(8)
          .fill(null)
          .map(() => Math.round(Math.random() * 36).toString(36))
          .join('');
        callback(null, `${randomName}${fileExtName}`)
      }
    })
  }))
  async addAnnouncement(
    @Body() dto: AnnouncementDto,
    @Req() req,
    @Res() res: Response,
    @UploadedFiles() photos: Array<Express.Multer.File>,
  ) {
    const response = [];
    photos.forEach(file => {
      const fileReponse = file.filename;
      response.push(fileReponse);
    });
    dto.photos = response;
    const status = await this.announcementService.add(dto, req.cookies['Authentication']);
    if (status === 'good') {
      return res.redirect('/');
    } else {
      req.flash('registerError', status);
      res.redirect('/');
    }
  }


  

}


