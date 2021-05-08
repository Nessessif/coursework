import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Sale, SaleDoc } from './sales.shema';
import { SaleAnnouncement } from './structure/sale-announcement';

export class SaleRepository {
  constructor(@InjectModel(Sale.name) private saleModel: Model<SaleDoc>) {}

  async getSales(count: number, skip: number): Promise<SaleDoc>;
  // return await this.saleModel.find().lean();

  async getSales(count: number): Promise<SaleDoc>;
  // return await this.saleModel.find().lean();

  async getSales(count: number, skip?: number): Promise<SaleDoc> {
    if (skip) {
      return await this.saleModel
        .find()
        .skip(skip * count)
        .limit(count)
        .lean();
    } else {
      return await this.saleModel.find().limit(count).lean();
    }
  }

  // async getByEmail(email: string): Promise<UserDoc> {
  //     return await this.userModel.findOne({
  //         email: email,
  //     });
  // }

  async getCount() {
    // return await this.saleModel.count();
  }

  async add(announcement: SaleAnnouncement) {
    return await this.saleModel.create({
      _id: Types.ObjectId(),
      street: announcement.street,
      houseNumber: announcement.houseNumber,
      totalArea: announcement.totalArea,
      livingArea: announcement.livingArea,
      kitchenArea: announcement.kitchenArea,
      balcony: announcement.balcony,
      description: announcement.description,
      price: announcement.price,
      currency: announcement.currency,
      photos: announcement.photos,
      isBanned: announcement.isBanned,
      typeHouse: announcement.typeHouse,
      floor: announcement.floor,
      countOfFloors: announcement.countOfFloors,
      coordinates: announcement.coordinates,
      roomsCount: announcement.roomsCount,
      ownership: announcement.ownership,
    });
  }

  async getUserById(_id: string): Promise<SaleDoc> {
    return await this.saleModel.findById(Types.ObjectId(_id));
  }
}
