import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './users.schema';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { Rent, RentSchema } from 'src/announcement/rents.shema';
import { Sale, SaleSchema } from 'src/announcement/sales.shema';
import { RentRepository } from 'src/announcement/rent-announcement.repository copy';
import { SaleRepository } from 'src/announcement/sale-announcement.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rent.name, schema: RentSchema }]),
    MongooseModule.forFeature([{ name: Sale.name, schema: SaleSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, UsersRepository, RentRepository, SaleRepository],
  exports: [UsersService, UsersRepository, RentRepository, SaleRepository],
  controllers: [UsersController],
})
export class UsersModule {}
