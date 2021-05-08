import { Injectable, Req } from '@nestjs/common';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.schema';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private usersRepository: UsersRepository,
  ) { }

  async render(loginError: string, registerError: string) {
    return {
      title: 'Авторизация',
      isLogin: true,
      loginError,
      registerError,
      layout: 'layouts/main',
    };
  }

  async validateUser(email: string, password: string): Promise<User | string> {
    const user = await this.usersRepository.getByEmail(email);

    if (!user) {
      return 'Нет такого пользователя';
    }
    if (await bcrypt.compare(password, user.password)) {
      return user;
    }
    return 'Не корректно введены данные';
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(dto: RegisterUserDto, confirm: string): Promise<string> {
    const user = await this.usersRepository.getByEmail(dto.email);
    if (user) {
      return 'Такой email уже зарегестрирован';
    }
    if (dto.password !== confirm) {
      return 'Пароли не совпадают';
    }

    await this.usersRepository.registerUser(dto);
    return 'good';
  }




}
