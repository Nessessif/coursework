import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Render,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
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

  @Get('support')
  @Render('userSupport')
  userSupport(@Req() req, @Res() res: Response) {
    if (!req.cookies['Authentication']) {
      res.redirect('/');
    }
    return this.announcementService.renderSupport(req.cookies['Authentication']);
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
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const fileExtName = extname(file.originalname);
          const randomName = Array(8)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  async addAnnouncement(
    @Body() dto: AnnouncementDto,
    @Req() req,
    @Res() res: Response,
    @UploadedFiles() photos: Array<Express.Multer.File>,
  ) {
    const response = [];
    photos.forEach((file) => {
      const fileReponse = file.filename;
      response.push(fileReponse);
    });
    dto.photos = response;
    const status = await this.announcementService.add(
      dto,
      req.cookies['Authentication'],
    );
    if (status === 'good') {
      return res.redirect('/');
    } else {
      req.flash('registerError', status);
      res.redirect('/');
    }
  }

  @Get('sale/:_id')
  @Render('outSale')
  async outSales(@Req() req, @Param() params) {
    return await this.announcementService.getOneSales(
      req.cookies['Authentication'],
      params._id,
    );
  }

  @Get('rent/:_id')
  @Render('outRent')
  async outRents(@Req() req, @Param() params) {
    return await this.announcementService.getOneRents(
      req.cookies['Authentication'],
      params._id,
    );
  }

  @Get('sale/edit/:_id')
  @Render('editSale')
  async editSales(@Req() req, @Res() res, @Param() params) {
    if (!req.cookies['Authentication']) {
      res.redirect('/');
    }
    return await this.announcementService.getSale(
      req.cookies['Authentication'],
      params._id,
    );
  }

  @Get('rent/edit/:_id')
  @Render('editRent')
  async editRents(@Req() req, @Res() res, @Param() params) {
    if (!req.cookies['Authentication']) {
      res.redirect('/');
    }
    return await this.announcementService.getRent(
      req.cookies['Authentication'],
      params._id,
    );
  }

  @Get('testAllSales')
  async getAllSales(@Req() req) {
    return await this.announcementService.getAllSales();
  }

  @Get('testAllRents')
  async getAllRents(@Req() req) {
    return await this.announcementService.getAllRents();
  }


  @Get('sales/:imgpath')
  async sendImagesSales(@Res() res: Response, @Param('imgpath') img) {
    return res.sendFile(img, {
      root: 'uploads'
    });
  }

  @Get('rents/:imgpath')
  async sendImagesRents(@Res() res: Response, @Param('imgpath') img) {
    return res.sendFile(img, {
      root: 'uploads'
    });
  }

  @Post('filter')
  async getFilter(@Req() req, @Res() res: Response) {
    res
      .status(200)
      .json(
        await this.announcementService.getFilter(
          req.body
        ),
      );
  }

  @Post('sort')
  async getSort(@Req() req, @Res() res: Response) {
    res
      .status(200)
      .json(
        await this.announcementService.getSort(
          req.body
        ),
      );
  }

  @Post('search')
  async getSearch(@Req() req, @Res() res: Response) {
    res
      .status(200)
      .json(
        await this.announcementService.getSearch(
          req.body
        ),
      );
  }


  @Post('sale/edit')
  async editSale(
    @Body() dto: AnnouncementDto,
    @Req() req,
    @Res() res: Response,
  ) {
    const status = await this.announcementService.edit(
      req.body._id,
      dto,
      req.cookies['Authentication'],
    );
    if (status === 'good') {
      return res.redirect(`/users/profile/${req.cookies['Authentication']}`);
    } else {
      req.flash('registerError', status);
      res.redirect(`/users/profile/${req.cookies['Authentication']}`);
    }
  }

  @Post('rent/edit')
  async editRent(
    @Body() dto: AnnouncementDto,
    @Req() req,
    @Res() res: Response,
  ) {
    const status = await this.announcementService.edit(
      req.body._id,
      dto,
      req.cookies['Authentication'],
    );
    if (status === 'good') {
      return res.redirect(`/users/profile/${req.cookies['Authentication']}`);
    } else {
      req.flash('registerError', status);
      res.redirect(`/users/profile/${req.cookies['Authentication']}`);
    }
  }


  @Get('sale/delete/:_id')
  async deleteSales(
    @Req() req,
    @Res() res: Response,
    @Param() params,
  ) {
    const status = await this.announcementService.deleteSales(
      params._id,
      req.cookies['Authentication'],
    );
    if (status === 'good') {
      return res.redirect(`/users/profile/${req.cookies['Authentication']}`);
    } else {
      req.flash('registerError', status);
      res.redirect(`/users/profile/${req.cookies['Authentication']}`);
    }
  }

  @Get('rent/delete/:_id')
  async deleteRents(
    @Req() req,
    @Res() res: Response,
    @Param() params,
  ) {
    const status = await this.announcementService.deleteRents(
      params._id,
      req.cookies['Authentication'],
    );
    if (status === 'good') {
      return res.redirect(`/users/profile/${req.cookies['Authentication']}`);
    } else {
      req.flash('registerError', status);
      res.redirect(`/users/profile/${req.cookies['Authentication']}`);
    }
  }

  @Get('sale/:_id/:imgpath')
  async sendImage(@Res() res: Response, @Param('imgpath') img) {
    return res.sendFile(img, {
      root: 'uploads',
    });
  }


  @Get('rent/:_id/:imgpath')
  async sendRentImage(@Res() res: Response, @Param('imgpath') img) {
    return res.sendFile(img, {
      root: 'uploads',
    });
  }
}
