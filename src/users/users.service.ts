import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RegisterUserDto } from './dto/register-user.dto';
import { User, UserDoc } from './users.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userRepository: Model<UserDoc>) {}

  async getAllUsers(): Promise<UserDoc> {
    return await this.userRepository.find().lean();
  }

  async getByEmail(email: string): Promise<UserDoc> {
    return await this.userRepository.findOne({
      email: email,
    });
  }

  async registerUser(dto: RegisterUserDto) {
    // dto.password = await bcrypt.hash(dto.password, 10);
    return await this.userRepository.create({
      _id: Types.ObjectId(),
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
      username: dto.username,
      phoneNumber: dto.phoneNumber,
    });
  }

  async getUserById(_id: string): Promise<UserDoc> {
    return this.userRepository.findById(_id);
  }
}
