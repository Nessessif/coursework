import { AnnouncementDto } from "../dto/announcement.dto";

export abstract class Announcement {

  street: string;
  houseNumber: string;
  totalArea: number;
  livingArea: number;
  kitchenArea: number;
  balcony: string;
  description: string;
  price: number;
  currency: string;
  photos: string[];
  typeHouse: string;
  countOfFloors: number;
  floor: number;

  isBanned: boolean;

  coordinates: string;

  constructor(dto: AnnouncementDto) {
    this.street = dto.street;
    this.houseNumber = dto.houseNumber;
    this.totalArea = dto.totalArea;
    this.livingArea = dto.livingArea;
    this.kitchenArea = dto.kitchenArea;
    this.balcony = dto.balcony;
    this.description = dto.description;
    this.price = dto.price;
    this.currency = dto.currency;
    this.photos = dto.photos;
    this.typeHouse = dto.typeHouse;
    this.countOfFloors = dto.countOfFloors;
    this.floor = dto.floor;
    this.isBanned = dto.isBanned;
    this.coordinates = dto.coordinates;
  }

  // abstract add(): string;

}
