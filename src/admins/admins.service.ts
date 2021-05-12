import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Admin, AdminDoc } from './admins.schema';
import { AdminDto } from './dto/adminDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AdminsReporitory } from './admins.repository';
import { UsersRepository } from 'src/users/users.repository';
import { MessagesReporitory } from 'src/messages/messages.repository';

@Injectable()
export class AdminsService {
    constructor(
        private jwtService: JwtService,
        private adminsReporitory: AdminsReporitory,
        private usersRepository: UsersRepository,
        private messagesRepository: MessagesReporitory,
    ) { }

    async register(dto: AdminDto): Promise<string> {
        const user = await this.adminsReporitory.getByLogin(dto.login);
        if (user) {
            return 'Такой email уже зарегестрирован';
        }
        await this.adminsReporitory.add(dto);
        return 'good';
    }

    async render(loginError: string) {
        return {
            title: 'Its Adminka',
            loginError,
            isAdmin: true,
            layout: 'layouts/main',
        };
    }

    async addAdmin(loginError: string, adminId: string) {
        const admin = await this.adminsReporitory.getById(adminId);
        return {
            title: 'Its Adminka',
            loginError,
            isAdmin: true,
            isLogin: true,
            layout: 'layouts/main',
            admin,
        };
    }

    async deleteAdmin(loginError: string, adminId: string) {
        const admins = await this.adminsReporitory.getAll();
        const admin = await this.adminsReporitory.getById(adminId);
        return {
            title: 'Its Adminka',
            loginError,
            isAdmin: true,
            layout: 'layouts/main',
            admin,
            isLogin: true,
            admins,
        };
    }

    async supportAdmin(loginError: string, adminId: string) {
        const cards = await this.messagesRepository.getAll();
        const admin = await this.adminsReporitory.getById(adminId);
        return {
            title: 'Its Adminka',
            loginError,
            isAdmin: true,
            layout: 'layouts/main',
            admin,
            isLogin: true,
            cards
        };
    }

    async renderAdmin(adminId: string) {
        const admin = await this.adminsReporitory.getById(adminId);
        const users = await this.usersRepository.getAllUsers();
        return {
            title: 'Its Adminka',
            isLogin: true,
            isAdmin: true,
            layout: 'layouts/main',
            admin,
            users,
        };

    }



    // async login(admin: Admin): Promise<{ access_token: string }> {
    //     const payload = { sub: admin._id, login: admin.login };
    //     return {
    //         access_token: this.jwtService.sign(payload),
    //     };
    // }

    async validateAdmin(login: string, password: string): Promise<Admin | string> {
        const user = await this.adminsReporitory.getByLogin(login);
        if (!user) {
            return 'Нет такого админа';
        }
        if (await bcrypt.compare(password, user.password)) {
            return user;
        }
        return 'Ошибка ввода данных';
    }

    async unbanUser(userId) {
        return await this.usersRepository.unban(userId);
    }

    async banUser(userId) {
        return await this.usersRepository.ban(userId);
    }


    async delete(userId) {
        return await this.adminsReporitory.delete(userId);
    }

}


