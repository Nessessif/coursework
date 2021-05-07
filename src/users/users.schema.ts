import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDoc = Document & User;

@Schema()
export class User {
  @Prop()
  _id: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: false })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Sale' }] })
  salesId: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Rent' }] })
  rentsId: Types.ObjectId[];

  @Prop({ required: true, default: false })
  banned: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
