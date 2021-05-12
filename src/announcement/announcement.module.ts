import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { UsersModule } from 'src/users/users.module';
import { User, UserSchema } from 'src/users/users.schema';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
import { RentRepository } from './rent-announcement.repository';
import { Rent, RentSchema } from './rents.shema';
import { SaleRepository } from './sale-announcement.repository';
import { Sale, SaleSchema } from './sales.shema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Rent.name, schema: RentSchema }]),
    MongooseModule.forFeature([{ name: Sale.name, schema: SaleSchema }]),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './upload',
      }),
    })
  ],
  controllers: [AnnouncementController],
  providers: [AnnouncementService, RentRepository, SaleRepository],
  exports: [AnnouncementService, RentRepository, SaleRepository],
})
export class AnnouncementModule { }
