import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  render() {
    return {
      title: 'Главная страница',
      message: 'dsfdsf',
      isHome: true,
      layout: 'layouts/main',
    };
  }
}