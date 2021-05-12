import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { MessagesModule } from 'src/messages/messages.module';
import { Message, MessageSchema } from 'src/messages/messages.shema';
import { UsersModule } from 'src/users/users.module';
import { User, UserSchema } from 'src/users/users.schema';
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
    UsersModule,
    MessagesModule,
    JwtModule.register({
      secret: process.env.jwtSecret,
      signOptions: { expiresIn: '7d' },
    }),

    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),

  ],
  controllers: [AdminsController],
  providers: [AdminsService, LocalAdminStrategy, JwtStrategy, AdminsReporitory],
  exports: [AdminsService, JwtModule, AdminsReporitory],
})
export class AdminsModule { }
