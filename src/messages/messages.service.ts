import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersRepository } from 'src/users/users.repository';
import { MessagesDto } from './dto/messagesDto';
import { MessagesReporitory } from './messages.repository';

@Injectable()
export class MessagesService {
    constructor(
        private messagesRepository: MessagesReporitory,
        private usersRepository: UsersRepository,
    ) { }

    async add(dto: MessagesDto, _id: string) {
        try {
            let email = await this.usersRepository.getEmail(_id);
            dto.email = email
            dto.userId = Types.ObjectId(_id)
            await this.messagesRepository.add(dto);
            return 'good'
        }
        catch (e) {
            console.log(e);
        }
        return 'error';
    }

    async getMessages() {
        return await this.messagesRepository.getAll();
    }
}
