import { Types } from "mongoose";

export class MessagesDto {
    email: string;
    userId: Types.ObjectId;
    text: string;
}