import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { Rent, RentDoc } from './rents.shema';
import { RentAnnouncement } from './structure/rent-announcement';


export class RentRepository implements AnnouncementInterface {
  constructor(@InjectModel(Rent.name) private rentModel: Model<RentDoc>) { }


  async getRents(count: number, skip: number): Promise<RentDoc>;
  // return await this.saleModel.find().lean();

  async getRents(count: number): Promise<RentDoc>;
  // return await this.saleModel.find().lean();

  async getRents(count: number, skip?: number): Promise<RentDoc> {
    if (skip) {
      return await this.rentModel
        .find()
        .skip((skip - 1) * count)
        .limit(count)
        .lean();
    } else {
      return await this.rentModel.find().limit(count).lean();
    }
  }

  async getCount() {
    return await this.rentModel.countDocuments();
  }

  async add(announcement: RentAnnouncement) {
    return await this.rentModel.create({
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
      typeOfRent: announcement.typeOfRent,
      dueDate: announcement.dueDate,
    });
  }

  async getById(_id: string): Promise<RentDoc> {
    return await this.rentModel.findById(Types.ObjectId(_id));
  }

  async getAll() {
    return await this.rentModel.find();
  }
  async removeById(_id: string) {
    return await this.rentModel.deleteOne({ _id: Types.ObjectId(_id) });
  }

  async getFilter(filter) {
    let announcements = await this.rentModel.find({
      $and: [
        { totalArea: { $gt: filter.totalAreaMin, $lt: filter.totalAreaMax } },
        { livingArea: { $gt: filter.livingAreaMin, $lt: filter.livingAreaMax } },
        { kitchenArea: { $gt: filter.kitchenAreaMin, $lt: filter.kitchenAreaMax } },
        { price: { $gt: filter.priceMin, $lt: filter.priceMax } },
      ]
    })

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

    if (filter.hasOwnProperty('typeOfRent')) {
      announcements = announcements.filter(function (el, index, arr) {
        return el.typeOfRent === filter.typeOfRent;
      });
    }

    if (filter.hasOwnProperty('dueDate')) {
      announcements = announcements.filter(function (el, index, arr) {
        return el.dueDate === filter.dueDate;
      });
    }

    return announcements;
  }

  async getSort(filter) {
    let announcements = await this.rentModel.find()

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
    let announcements = await this.rentModel.find({ street: re })
    return announcements;
  }

  async delete(announcementId) {
    return await this.rentModel.findOneAndDelete({ _id: Types.ObjectId(announcementId) })
  }


  async edit(announcementId, dto) {
    return await this.rentModel.findOneAndUpdate({ _id: Types.ObjectId(announcementId) }, {
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
