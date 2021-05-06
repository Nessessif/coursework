import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RentDoc = Document & Rent;

@Schema()
export class Rent {
    @Prop()
    _id: Types.ObjectId;

    @Prop({ required: true })
    street: string;

    @Prop({ required: true })
    houseNumber: string;

    @Prop({ required: true })
    totalArea: number;

    @Prop({ required: true })
    livingArea: number;

    @Prop({ required: true })
    kitchenArea: number;

    @Prop({ required: true })
    balcony: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    currency: string;

    @Prop({ required: true })
    photos: string[];

    @Prop({ required: true, default: false })
    isBanned: boolean;

    @Prop({ required: true })
    typeHouse: string;

    @Prop({ required: true })
    floor: number;

    @Prop({ required: true })
    countOfFloors: number;

    @Prop({ required: false })
    coordinates: string;

    //=============================================

    @Prop({ required: true })
    typeOfRent: string;

    @Prop({ required: true })
    dueDate: string;

}

export const RentSchema = SchemaFactory.createForClass(Rent);
