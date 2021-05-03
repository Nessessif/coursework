import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AdminsController } from './admins.controller';
import { AdminsReporitory } from './admins.repository';
import { Admin, AdminSchema } from './admins.schema';
import { AdminsService } from './admins.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalAdminStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    AdminsModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.jwtSecret,
      signOptions: { expiresIn: '7d' },
    }),
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),

  ],
  controllers: [AdminsController],
  providers: [AdminsService, LocalAdminStrategy, JwtStrategy, AdminsReporitory],
  exports: [AdminsService, JwtModule, AdminsReporitory],
})
export class AdminsModule { }
