import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
import { RentRepository } from './rent-announcement.repository copy';
import { Rent, RentSchema } from './rents.shema';
import { SaleRepository } from './sale-announcement.repository';
import { Sale, SaleSchema } from './sales.shema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rent.name, schema: RentSchema }]),
    MongooseModule.forFeature([{ name: Sale.name, schema: SaleSchema }]),
  ],
  controllers: [AnnouncementController],
  providers: [AnnouncementService, RentRepository, SaleRepository],
  exports: [AnnouncementService, RentRepository, SaleRepository],
})
export class AnnouncementModule { }
