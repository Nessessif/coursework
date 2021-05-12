import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDoc = Document & Message;

@Schema()
export class Message {
    @Prop()
    _id: Types.ObjectId;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true, ref: 'Users' })
    userId: Types.ObjectId;

    @Prop({ required: true })
    text: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
