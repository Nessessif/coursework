import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AdminDto } from './dto/adminDto';

export type AdminDoc = Document & Admin;

@Schema()
export class Admin {
  @Prop()
  _id: Types.ObjectId;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
