import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Message, MessageDoc } from "./messages.shema";
import { MessagesDto } from "./dto/messagesDto";

export class MessagesReporitory {
    constructor(@InjectModel(Message.name) private messageModule: Model<MessageDoc>) { }

    async add(dto: MessagesDto) {
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

    async getById(_id: string): Promise<MessageDoc> {
        return await this.messageModule.findById(Types.ObjectId(_id));
    }

    async removeById(_id: string) {
        return await this.messageModule.deleteOne({ _id: Types.ObjectId(_id) });
    }

}