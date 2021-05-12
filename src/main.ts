import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as flash from 'connect-flash';
import { AppModule } from './app.module';
import * as hbs from 'hbs';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as nodemailer from 'nodemailer';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  // app.useStaticAssets(join(__dirname, '..', 'uploads'));
  // app.use('./uploads', express.static(join(__dirname, '..', 'uploads')));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
  // app.set('view options ', { layout: join('layouts', 'main') });

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(flash());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());



  hbs.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  await app.listen(process.env.PORT);
  console.log(`start server ${process.env.PORT}`);
}
bootstrap();
