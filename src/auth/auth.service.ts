import { Injectable, Req } from '@nestjs/common';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async render(loginError: string, registerError: string) {
    return {
      title: 'Авторизация',
      isLogin: true,
      loginError,
      registerError,
      layout: 'layouts/main',
    };
  }

  // async getError(@Req() req) {
  //   return req.flash('loginError'),
  // }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.getByEmail(email);
    console.log(user);

    if (!user) {
      return null;
    }
    if (bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { sub: user._id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(dto: RegisterUserDto, confirm: string): Promise<string> {
    const user = await this.usersService.getByEmail(dto.email);
    if (user) {
      return 'Такой email уже зарегестрирован';
    }
    if (dto.password !== confirm) {
      return 'Пароли не совпадают';
    }

    await this.usersService.registerUser(dto);
    return 'good';
  }
}
