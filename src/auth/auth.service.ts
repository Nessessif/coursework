import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { User, UserDoc } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async render() {
    return {
      title: 'Авторизация',
      isLogin: true,
      layout: 'layouts/main',
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
