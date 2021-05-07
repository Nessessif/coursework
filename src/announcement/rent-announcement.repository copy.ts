import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { Rent, RentDoc } from './rents.shema';
import { RentAnnouncement } from './structure/rent-announcement';

export class RentRepository {

    constructor(@InjectModel(Rent.name) private rentModel: Model<RentDoc>) { }

    async getAllRents(): Promise<RentDoc> {
        return await this.rentModel.find().lean();
    }

    async add(announcement: RentAnnouncement) {
        return await this.rentModel.create({
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
            typeOfRent: announcement.typeOfRent,
            dueDate: announcement.dueDate,
        });
    }

    async getRentById(_id: string): Promise<RentDoc> {
        return await this.rentModel.findById(Types.ObjectId(_id));
    }
}
