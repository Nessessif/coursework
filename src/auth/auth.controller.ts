import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @Render('auth')
  async render() {
    return this.authService.render();
  }

  @Post('register')
  async register(
    @Body() dto: RegisterUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const status = await this.authService.register(dto, req.body.confirm);
    if (status === 'good') {
      return res.redirect('/auth#login');
    } else {
      console.log(status);

      res.redirect('/auth#register');
    }
  }
}
