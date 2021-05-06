import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users/users.repository';

@Injectable()
export class AppService {
  constructor(private usersRepository: UsersRepository) {}
  async render(isAuth) {
    const user = await this.usersRepository.getUserById(isAuth);
    return {
      title: 'Главная страница',
      message: 'dsfdsf',
      isHome: true,
      layout: 'layouts/main',
      user,
    };
  }
}
