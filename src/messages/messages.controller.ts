import { Body, Controller, Get, Post, Render, Req, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { Response, Request } from 'express';
import { MessagesDto } from './dto/messagesDto';
import { MessagesService } from './messages.service';
import * as nodemailer from 'nodemailer';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Post('support/send')
    async sendMessage(
        @Body() dto: MessagesDto,
        @Req() req,
        @Res() res: Response,
    ) {
        const status = await this.messagesService.add(dto, req.cookies['Authentication']);
        if (status === 'good') {
            return res.redirect('/');
        }
    }

    @Post('sendAnswer')
    async sendAnswer(
        @Req() req,
        @Res() res: Response) {
        let toMail = `<h1>Answer</h1>
                    <p>${req.body.answer}</p>`

        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.mail.ru",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'quasimodo_it@mail.ru', // generated ethereal user
                pass: 'isipat41', // generated ethereal password
            },
            tsl: {
                rejectUnauthorized: false
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Coursework Support" <quasimodo_it@mail.ru>', // sender address
            to: `${req.body.email}`, // list of receivers
            subject: "Support request", // Subject line
            text: "Hello world?", // plain text body
            html: toMail, // html body
        });

        await this.messagesService.deleteById(req.body._id);
        res.redirect(`/admin/login/${req.cookies['Admin']}`)
    }

    @Get('getMessage')
    @Render('auth')
    async render(@Req() req, @Res() res: Response) {
        return await this.messagesService.getMessages();
    }



}
