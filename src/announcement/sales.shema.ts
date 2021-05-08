import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SaleDoc = Document & Sale;

@Schema()
export class Sale {
    @Prop()
    _id: Types.ObjectId;

    @Prop({ required: true })
    street: string;

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
    //=============================================

    @Prop({ required: true })
    roomsCount: string;

    @Prop({ required: true })
    ownership: string;

}

export const SaleSchema = SchemaFactory.createForClass(Sale);
