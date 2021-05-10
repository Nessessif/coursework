import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Sale, SaleDoc } from './sales.shema';
import { SaleAnnouncement } from './structure/sale-announcement';

export class SaleRepository implements AnnouncementInterface {
  constructor(@InjectModel(Sale.name) private saleModel: Model<SaleDoc>) { }

  async getSales(count: number, skip: number): Promise<SaleDoc>;

  async getSales(count: number): Promise<SaleDoc>;

  async getSales(count: number, skip?: number): Promise<SaleDoc> {
    if (skip) {
      return await this.saleModel
        .find()
        .skip((skip - 1) * count)
        .limit(count)
        .lean();
    } else {
      return await this.saleModel.find().limit(count).lean();
    }
  }

  async getCount() {
    return await this.saleModel.countDocuments();
  }

  async add(announcement: SaleAnnouncement) {
    return await this.saleModel.create({
      _id: Types.ObjectId(),
      street: announcement.street,
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
      roomsCount: announcement.roomsCount,
      ownership: announcement.ownership,
    });
  }

  async getById(_id: string): Promise<SaleDoc> {
    return await this.saleModel.findById(Types.ObjectId(_id));
  }

  async getAll() {
    return await this.saleModel.find();
  }

  async removeById(_id: string) {
    return await this.saleModel.deleteOne({ _id: Types.ObjectId(_id) });
  }
}
