import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('login')
  @Render('auth')
  async render(@Req() req, @Res() res: Response) {
    if (req.cookies['Authentication'] || req.cookies['Admin']) {
      res.redirect('/');
    }

    return await this.authService.render(
      req.flash('loginError'),
      req.flash('registerError'),
    );
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() request, @Res() res: Response) {
    if (typeof request.user === 'object') {
      // const token = await this.authService.login(request.user);
      // res.cookie('Authentication', token.access_token);
      res.cookie('Authentication', request.user._id);
      res.redirect('/');
    }
    request.flash('loginError', request.user);
    res.redirect('/auth/login#login');
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('Authentication');
    res.redirect('/');
  }

  @Post('register')
  async register(
    @Body() dto: RegisterUserDto,
    @Req() req,
    @Res() res: Response,
  ) {
    const status = await this.authService.register(dto, req.body.confirm);
    if (status === 'good') {
      return res.redirect('/auth/login#login');
    } else {
      req.flash('registerError', status);
      res.redirect('/auth/login#register');
    }
  }
}
