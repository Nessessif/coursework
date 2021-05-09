import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RegisterUserDto } from './dto/register-user.dto';
import { User, UserDoc } from './users.schema';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { RentRepository } from 'src/announcement/rent-announcement.repository copy';
import { SaleRepository } from 'src/announcement/sale-announcement.repository';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private rentRepository: RentRepository,
    private saleRepository: SaleRepository,
    private usersRepository: UsersRepository,
  ) {}

  async renderProfile(_id) {
    const user = await this.usersRepository.getUserById(_id);
    const sales = await this.getSalesByUser(_id);
    const rents = await this.getRentsByUser(_id);
    return {
      title: 'Профиль',
      layout: 'layouts/main',
      user,
      sales,
      rents,
      isProfile: true,
    };
  }

  async renderEditProfile(_id, editError) {
    const user = await this.usersRepository.getUserById(_id);
    return {
      title: 'Редактирование',
      layout: 'layouts/main',
      editError,
      user,
    };
  }

  async editUser(dto: EditUserDto): Promise<string> {
    if (dto.password !== dto.confirm) {
      return 'Пароли не совпадают';
    }
    await this.usersRepository.editUser(dto);
    return 'good';
  }

  async removeUser(_id) {
    try {
      const sales = await this.getSalesByUser(_id);
      const rents = await this.getRentsByUser(_id);
      if (sales.length !== 0) {
        for (const sale of sales) {
          await this.saleRepository.removeById(sale._id);
        }
      }
      if (rents.length !== 0) {
        for (const rent of rents) {
          await this.rentRepository.removeById(rent._id);
        }
      }
      await this.usersRepository.removeById(_id);
    } catch (error) {
      console.log(error);
    }
  }

  async getSalesByUser(_id: string) {
    const user = await this.usersRepository.getUserById(_id);
    if (user.salesId.length != 0) {
      let sales = [];
      for (const saleId of user.salesId) {
        let sale = await this.saleRepository.getSaleById(saleId.toHexString());
        if (sale.photos.length != 0) {
          sale.photos.forEach((photo) => {
            const oldName = photo;
            photo = '.uploads/' + oldName;
          });
        }
        sales.push(sale);
      }
      return sales;
    } else return 'Sales is empty';
  }

  async getRentsByUser(_id: string) {
    const user = await this.usersRepository.getUserById(_id);
    if (user.rentsId.length != 0) {
      let rents = [];
      for (const rentId of user.rentsId) {
        let rent = await this.rentRepository.getRentById(rentId.toHexString());
        if (rent.photos.length != 0) {
          rent.photos.forEach((photo) => {
            const oldName = photo;
            photo = '.uploads/' + oldName;
          });
        }
        rents.push(rent);
      }
      return rents;
    } else return 'Rents is empty';
  }
}
