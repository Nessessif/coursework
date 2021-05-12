import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminsService } from '../admins.service';


@Injectable()
export class LocalAdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(private adminService: AdminsService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const admin = await this.adminService.validateAdmin(username, password);
    return admin;
  }
}
