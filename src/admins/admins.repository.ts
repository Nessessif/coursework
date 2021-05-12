import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Admin, AdminDoc } from "./admins.schema";
import { AdminDto } from "./dto/adminDto";
import * as bcrypt from 'bcrypt';

export class AdminsReporitory {
    constructor(@InjectModel(Admin.name) private adminModule: Model<AdminDoc>) { }

    async registerUser(dto: AdminDto) {
        return await this.adminModule.create({
            _id: Types.ObjectId(),
            login: dto.login,
            password: await bcrypt.hash(dto.password, 10),
        });
    }


    async add(dto: AdminDto) {
        return await this.adminModule.create({
            _id: Types.ObjectId(),
            login: dto.login,
            password: await bcrypt.hash(dto.password, 10),
        });
    }

    async delete(userId) {
        return await this.adminModule.findOneAndDelete({ _id: Types.ObjectId(userId) })
    }

    async getAll() {
        return await this.adminModule.find();
    }

    async getById(_id: string): Promise<AdminDoc> {
        return await this.adminModule.findById(Types.ObjectId(_id));
    }

    async getByLogin(login: string): Promise<AdminDoc> {
        return await this.adminModule.findOne({
            login: login,
        });
    }
}