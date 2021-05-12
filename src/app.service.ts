import { Injectable } from '@nestjs/common';
import { RentRepository } from './announcement/rent-announcement.repository';
import { SaleRepository } from './announcement/sale-announcement.repository';
import { UsersRepository } from './users/users.repository';

@Injectable()
export class AppService {
  constructor(
    private usersRepository: UsersRepository,
    private saleRepository: SaleRepository,
    private rentRepository: RentRepository,
  ) { }
  async render(isAuth) {
    const user = await this.usersRepository.getUserById(isAuth);
    const sales = await this.saleRepository.getSales(8);
    const rents = await this.rentRepository.getRents(8);
    return {
      title: 'Главная страница',
      layout: 'layouts/main',
      user,
      sales,
      rents,
    };
  }
}
