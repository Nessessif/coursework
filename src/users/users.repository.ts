import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RegisterUserDto } from './dto/register-user.dto';
import { User, UserDoc } from './users.schema';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto/edit-user.dto';

export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDoc>) { }

  async unban(userId) {
    return await this.userModel.updateOne(
      { _id: Types.ObjectId(userId) },
      { banned: false },
      { new: true, useFindAndModify: false },
    );
  }

  async ban(userId) {
    return await this.userModel.updateOne(
      { _id: Types.ObjectId(userId) },
      { banned: true },
      { new: true, useFindAndModify: false },
    );
  }

  async deleteSale(announcementId, userId) {
    return await this.userModel.updateOne(
      { _id: Types.ObjectId(userId) },
      { $pull: { salesId: Types.ObjectId(announcementId) } },
      { new: true, useFindAndModify: false },
    );
  }

  async deleteRent(announcementId, userId) {
    return await this.userModel.updateOne(
      { _id: Types.ObjectId(userId) },
      { $pull: { rentsId: Types.ObjectId(announcementId) } },
      { new: true, useFindAndModify: false },
    );
  }

  async getAllUsers(): Promise<UserDoc> {
    return await this.userModel.find().lean();
  }

  async getByEmail(email: string): Promise<UserDoc> {
    return await this.userModel.findOne({
      email: email,
    });
  }

  async removeById(_id: string) {
    return await this.userModel.deleteOne({ _id: Types.ObjectId(_id) });
  }

  async updateSales(_id: string, saleId: string) {
    return await this.userModel.findOneAndUpdate(
      { _id: Types.ObjectId(_id) },
      { $push: { salesId: [Types.ObjectId(saleId)] } },
      { new: true, useFindAndModify: false },
    );
  }

  async updateRents(_id: string, rentId: string) {
    return await this.userModel.findOneAndUpdate(
      { _id: Types.ObjectId(_id) },
      { $push: { rentsId: [Types.ObjectId(rentId)] } },
      { new: true, useFindAndModify: false },
    );
  }

  async registerUser(dto: RegisterUserDto) {
    return await this.userModel.create({
      _id: Types.ObjectId(),
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
      username: dto.username,
      phoneNumber: dto.phoneNumber,
    });
  }

  async getUserById(_id: string): Promise<UserDoc> {
    return await this.userModel.findById(Types.ObjectId(_id));
  }


  async getEmail(_id: string) {
    let user = await this.userModel.findOne({ _id: Types.ObjectId(_id) })
    return user.email
  }

  async getUserBySaleId(_id: string) {
    return await this.userModel.findOne({ salesId: Types.ObjectId(_id) });
  }

  async getUserByRentId(_id: string) {
    return await this.userModel.findOne({ rentsId: Types.ObjectId(_id) });
  }

  async editUser(dto: EditUserDto) {
    return await this.userModel.findOneAndUpdate(
      { _id: Types.ObjectId(dto._id) },
      {
        email: dto.email,
        password: await bcrypt.hash(dto.password, 10),
        username: dto.username,
        phoneNumber: dto.phoneNumber,
      },
      { new: true, useFindAndModify: false },
    );
  }
}
