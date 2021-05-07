import { AnnouncementDto } from "../dto/announcement.dto";
import { Announcement } from "../structure/abstract-announcement";

export class RentAnnouncement extends Announcement {

    typeOfRent: string;
    dueDate: string;

    constructor(dto: AnnouncementDto) {
        super(dto);
        this.typeOfRent = dto.typeOfRent;
        this.dueDate = dto.dueDate;
    };

    // async add(): string {
    //     return await 'pidor';
    // }
}