import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesController } from './messages.controller';
import { MessagesReporitory } from './messages.repository';
import { MessagesService } from './messages.service';
import { Message, MessageSchema } from './messages.shema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesReporitory],
  exports: [MessagesService, MessagesReporitory],
})
export class MessagesModule { }
