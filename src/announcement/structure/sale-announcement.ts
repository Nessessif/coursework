import { AnnouncementDto } from "../dto/announcement.dto";
import { Announcement } from "./abstract-announcement";

export class SaleAnnouncement extends Announcement {

  roomsCount: string;
  ownership: string;

  constructor(dto: AnnouncementDto) {
    super(dto);

    this.roomsCount = dto.roomsCount;
    this.ownership = dto.ownership;
  };

}




