import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users/users.repository';

@Injectable()
export class AppService {
  constructor(private usersRepository: UsersRepository) {}
  render(isAuth) {
    // const user = this.usersRepository.getUserById(isAuth);
    // console.log(user);

    return {
      title: 'Главная страница',
      message: 'dsfdsf',
      isHome: true,
      layout: 'layouts/main',
      isAuth,
      // user,
    };
  }
}
