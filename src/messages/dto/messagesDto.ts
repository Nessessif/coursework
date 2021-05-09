import { Types } from "mongoose";

export class MessagesDto {
    readonly email: string;
    readonly userId: Types.ObjectId;
    readonly text: string;
}