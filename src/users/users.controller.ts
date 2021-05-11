import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { EditUserDto } from './dto/edit-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile/:_id')
  @Render('profile')
  renderProfile(@Req() req, @Res() res: Response, @Param() params) {
    if (!req.cookies['Authentication']) {
      res.redirect('/');
    }
    return this.usersService.renderProfile(params._id);
  }

  @Get('profile/:_id/:imgpath')
  async sendRentImage(@Res() res: Response, @Param('imgpath') img) {
    return res.sendFile(img, {
      root: 'uploads',
    });
  }

  @Get('edit/:_id')
  @Render('editProfile')
  renderEditProfile(@Req() req, @Res() res: Response, @Param() params) {
    if (!req.cookies['Authentication']) {
      res.redirect('/');
    }
    return this.usersService.renderEditProfile(
      params._id,
      req.flash('editError'),
    );
  }

  @Post('edit')
  async register(@Body() dto: EditUserDto, @Req() req, @Res() res: Response) {
    const status = await this.usersService.editUser(dto);
    if (status === 'good') {
      return res.redirect('/');
    } else {
      req.flash('editError', status);
      res.redirect(`/users/edit/${dto._id}`);
    }
  }

  // @Get('testSales')
  // async getSalesUser(@Req() req) {
  //   return this.usersService.getSalesByUser(req.cookies['Authentication']);
  // }

  // @Get('testRents')
  // async getRentsUser(@Req() req) {
  //   return this.usersService.getRentsByUser(req.cookies['Authentication']);
  // }

  @Get('remove/:_id')
  async removeUser(@Req() req, @Res() res: Response, @Param() params) {
    if (!req.cookies['Authentication']) {
      res.redirect('/');
    }

    await this.usersService.removeUser(params._id);
    res.clearCookie('Authentication');
    res.redirect('/');
  }
}
