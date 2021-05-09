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
  ) { }

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

  async renderAllSales(isAuth) {
    const user = await this.usersRepository.getUserById(isAuth);
    const sales = await this.saleRepository.getSales(8);
    // const count = Math.ceil(await this.saleRepository.getCount());
    return {
      title: 'Продажа квартиры',
      layout: 'layouts/main',
      isSales: true,
      sales,
      user,
      // count,
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


  async getSalesByUser(_id: string) {
    const user = await this.usersRepository.getUserById(_id);
    if (user.salesId.length != 0) {
      let sales = [];
      for (const saleId of user.salesId) {
        let sale = await this.saleRepository.getSaleById(saleId.toHexString());
        if (sale.photos.length != 0) {
          sale.photos.forEach(photo => {
            const oldName = photo;
            photo = '.uploads/' + oldName;
          })
        }
        sales.push(sale);
      };
      return sales;
    } else return 'Sales is empty'
  }

  async getRentsByUser(_id: string) {
    const user = await this.usersRepository.getUserById(_id);
    if (user.rentsId.length != 0) {
      let rents = [];
      for (const rentId of user.rentsId) {
        let rent = await this.rentRepository.getRentById(rentId.toHexString());
        if (rent.photos.length != 0) {
          rent.photos.forEach(photo => {
            const oldName = photo;
            photo = '.uploads/' + oldName;
          })
        }
        rents.push(rent);
      };
      return rents;
    } else return 'Rents is empty'
  }


}
