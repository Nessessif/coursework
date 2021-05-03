import { Controller, Get, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
export class AdminsController {
    constructor(private readonly adminService: AdminsService) { }

    @Get()
    @Render('authAdmin')
    async render(@Req() req) {
        return this.adminService.render(
            req.flash('loginError'),
        );
    }

    @Post('login')
    @UseGuards(AuthGuard('admin'))
    async login(@Req() request, @Res() res: Response) {
        const token = await this.adminService.login(request.user);
        res.cookie('Admin', token.access_token);
        res.redirect(`/admin/${request.user._id}`);
    }

    @Get(':_id')
    @Render('admin')
    async renderAdmin(@Req() req) {
        return this.adminService.renderAdmin(
            req.flash('loginError'),
        );
    }

}

