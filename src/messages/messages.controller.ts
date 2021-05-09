import { Body, Controller, Get, Post, Render, Req, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { Response, Request } from 'express';
import { MessagesDto } from './dto/messagesDto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Post('sendMessage')
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


    @Get('getMessage')
    @Render('auth')
    async render(@Req() req, @Res() res: Response) {
        return await this.messagesService.getMessages();
    }


}
