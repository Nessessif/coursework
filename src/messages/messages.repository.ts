import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Message, MessageDoc } from "./messages.shema";
import { MessagesDto } from "./dto/messagesDto";

export class MessagesReporitory {
    constructor(@InjectModel(Message.name) private messageModule: Model<MessageDoc>) { }

    async add(dto: MessagesDto) {
        console.log(dto);

        return await this.messageModule.create({
            _id: Types.ObjectId(),
            email: dto.email,
            userId: dto.userId,
            text: dto.text,
        });
    }

    async getAll() {
        return await this.messageModule.find();
    }

}