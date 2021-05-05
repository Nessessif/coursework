import { Injectable } from '@nestjs/common';

@Injectable()
export class AnnouncementService {
  renderSale(isAuth) {
    return {
      title: 'Продажа квартиры',
      layout: 'layouts/main',
      isAuth,
    };
  }

  renderRent(isAuth) {
    return {
      title: 'Аренда квартиры',
      layout: 'layouts/main',
      isAuth,
    };
  }
}
