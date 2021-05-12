import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { User, UserSchema } from 'src/users/users.schema';
import { MessagesController } from './messages.controller';
import { MessagesReporitory } from './messages.repository';
import { MessagesService } from './messages.service';
import { Message, MessageSchema } from './messages.shema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesReporitory],
  exports: [MessagesService, MessagesReporitory],
})
export class MessagesModule { }
