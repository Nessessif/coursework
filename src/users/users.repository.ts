import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { RegisterUserDto } from "./dto/register-user.dto";
import { User, UserDoc } from "./users.schema";
import * as bcrypt from 'bcrypt';
import { Injectable } from "@nestjs/common";

export class UsersRepository {
    constructor(@InjectModel(User.name) private userModel: Model<UserDoc>) { }


    async getAllUsers(): Promise<UserDoc> {
        return await this.userModel.find().lean();
    }

    async getByEmail(email: string): Promise<UserDoc> {
        return await this.userModel.findOne({
            email: email,
        });
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
        return this.userModel.findById(_id);
    }
}