import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Admin, AdminDoc } from './admins.schema';
import { AdminDto } from './dto/adminDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AdminsReporitory } from './admins.repository';

@Injectable()
export class AdminsService {
    constructor(
        private jwtService: JwtService,
        private adminsReporitory: AdminsReporitory,
    ) { }

    async render(loginError: string) {
        return {
            title: 'Its Adminka',
            isLogin: true,
            loginError,
            isAdmin: true,
            layout: 'layouts/main',
        };
    }

    async renderAdmin(loginError: string) {
        return {
            title: 'Its Adminka',
            isLogin: true,
            loginError,
            isAdmin: true,
            layout: 'layouts/main',
        };
    }

    async login(admin: Admin): Promise<{ access_token: string }> {
        const payload = { sub: admin._id, login: admin.login };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateAdmin(login: string, password: string): Promise<Admin | null> {
        const user = await this.adminsReporitory.getByLogin(login);
        if (!user) {
            return null;
        }
        if (bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }


}


