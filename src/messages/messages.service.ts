import { Injectable } from '@nestjs/common';
import { MessagesDto } from './dto/messagesDto';
import { MessagesReporitory } from './messages.repository';

@Injectable()
export class MessagesService {
    constructor(
        private messagesRepository: MessagesReporitory,
    ) { }

    async add(dto: MessagesDto, _id: string) {
        try {
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
