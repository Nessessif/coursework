import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { extname } from 'path';
import { UsersRepository } from 'src/users/users.repository';
import { AnnouncementDto } from './dto/announcement.dto';
import { RentRepository } from './rent-announcement.repository copy';
import { SaleRepository } from './sale-announcement.repository';
import { RentAnnouncement } from './structure/rent-announcement';
import { SaleAnnouncement } from './structure/sale-announcement';

@Injectable()
export class AnnouncementService {
  constructor(
    private rentRepository: RentRepository,
    private saleRepository: SaleRepository,
    private usersRepository: UsersRepository,
  ) {}

  async renderSale(isAuth) {
    const user = await this.usersRepository.getUserById(isAuth);
    return {
      title: 'Продажа квартиры',
      layout: 'layouts/main',
      user,
    };
  }

  async renderRent(isAuth) {
    const user = await this.usersRepository.getUserById(isAuth);
    return {
      title: 'Аренда квартиры',
      layout: 'layouts/main',
      user,
    };
  }

  async getMoreSales(skip, count) {
    return await this.saleRepository.getSales(count, +skip);
  }

  async renderAllSales(isAuth) {
    const user = await this.usersRepository.getUserById(isAuth);
    const sales = await this.saleRepository.getSales(8);
    const countPage = await this.saleRepository.getCount();

    return {
      title: 'Продажа квартиры',
      layout: 'layouts/main',
      isSales: true,
      sales,
      user,
      countPage: Math.ceil(countPage / 8),
    };
  }

  async getMoreRents(skip, count) {
    return await this.rentRepository.getRents(count, +skip);
  }

  async renderAllRents(isAuth) {
    const user = await this.usersRepository.getUserById(isAuth);
    const rents = await this.rentRepository.getRents(8);
    const countPage = await this.rentRepository.getCount();

    return {
      title: 'Аренда квартиры',
      layout: 'layouts/main',
      isRents: true,
      rents,
      user,
      countPage: Math.ceil(countPage / 8),
    };
  }

  async add(dto: AnnouncementDto, userId: string): Promise<string> {
    try {

      if (dto.type === 'rent') {
        let announcement = new RentAnnouncement(dto);
        const item = await this.rentRepository.add(announcement);
        this.usersRepository.updateRents(userId, item._id);
        return 'good';
      } else if (dto.type === 'sale') {
        let announcement = new SaleAnnouncement(dto);
        const item = await this.saleRepository.add(announcement);
        this.usersRepository.updateSales(userId, item._id);
        return 'good';
      }
    }
    catch (e) {
      console.log(e);
    }
    return 'error';
  }



}
