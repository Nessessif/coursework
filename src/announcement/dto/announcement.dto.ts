export class AnnouncementDto {
    street: string;
    totalArea: number;
    livingArea: number;
    kitchenArea: number;
    balcony: string;
    description: string;
    price: number;
    currency: string;
    photos: string[];
    isBanned: boolean;
    typeHouse: string;
    floor: number;
    countOfFloors: number;
    //============================ Rent
    typeOfRent: string;
    dueDate: string;
    //============================ Sale
    roomsCount: string;
    ownership: string;
    //============================ Type
    type: string;
}