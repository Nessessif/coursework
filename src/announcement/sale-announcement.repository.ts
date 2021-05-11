import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Sale, SaleDoc } from './sales.shema';
import { SaleAnnouncement } from './structure/sale-announcement';
import { Announcement } from './structure/abstract-announcement';
import { ALL } from 'node:dns';
import { AnnouncementDto } from './dto/announcement.dto';

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

  async getFilter(filter) {
    let announcements = await this.saleModel.find({
      $and: [
        { totalArea: { $gt: filter.totalAreaMin, $lt: filter.totalAreaMax } },
        { livingArea: { $gt: filter.livingAreaMin, $lt: filter.livingAreaMax } },
        { kitchenArea: { $gt: filter.kitchenAreaMin, $lt: filter.kitchenAreaMax } },
        { price: { $gt: filter.priceMin, $lt: filter.priceMax } },
      ]
    })

    if (filter.hasOwnProperty('roomsCount')) {
      announcements = announcements.filter(function (el, index, arr) {
        return el.roomsCount === filter.roomsCount;
      });
    }

    if (filter.hasOwnProperty('typeHouse')) {
      announcements = announcements.filter(function (el, index, arr) {
        return el.typeHouse === filter.typeHouse;
      });
    }

    if (filter.hasOwnProperty('balcony')) {
      announcements = announcements.filter(function (el, index, arr) {
        return el.balcony === filter.balcony;
      });
    }

    if (filter.hasOwnProperty('ownership')) {
      announcements = announcements.filter(function (el, index, arr) {
        return el.ownership === filter.ownership;
      });
    }
    return announcements;
  }

  async getSort(filter) {
    let announcements = await this.saleModel.find()

    announcements.forEach(el => {
      if (el.currency === 'BYN') {
        el.price = el.price * 0.3944;
      } else if (el.currency === 'EUR') {
        el.price = el.price * 1.2075;
      }
    })

    if (filter.value === 'от дешевых к дорогим') {
      announcements.sort(function (a, b) {
        if (a.price > b.price) {
          return 1;
        }
        if (a.price < b.price) {
          return -1;
        }
        return 0;
      })
    } else {
      announcements.sort(function (a, b) {
        if (a.price < b.price) {
          return 1;
        }
        if (a.price > b.price) {
          return -1;
        }
        return 0;
      })
    }

    announcements.forEach(el => {
      if (el.currency === 'BYN') {
        el.price = el.price / 0.3944;
      } else if (el.currency === 'EUR') {
        el.price = el.price / 1.2075;
      }
      el.price = Math.round(el.price);
    })

    return announcements;
  }

  async getSearch(filter) {
    let re = new RegExp(filter.value + "*")
    let announcements = await this.saleModel.find({ street: re })
    return announcements;
  }

  async delete(announcementId) {
    return await this.saleModel.findOneAndDelete({ _id: Types.ObjectId(announcementId) })
  }

  async edit(announcementId, dto) {
    return await this.saleModel.findOneAndUpdate({ _id: Types.ObjectId(announcementId) }, {
      street: dto.street,
      totalArea: dto.totalArea,
      livingArea: dto.livingArea,
      kitchenArea: dto.kitchenArea,
      floor: dto.floor,
      price: dto.price,
      description: dto.description,
      countOfFloors: dto.countOfFloors,
    }, { new: true, useFindAndModify: false })
  }
}
