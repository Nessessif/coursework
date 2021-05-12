import { Body, Controller, Get, Param, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AdminDto } from './dto/adminDto';

@Controller('admin')
export class AdminsController {
    constructor(private readonly adminService: AdminsService) { }

    @Get('login')
    @Render('authAdmin')
    async render(@Req() req) {
        return this.adminService.render(
            req.flash('loginError'),
        );
    }

    @Get('add')
    @Render('addAdmin')
    async addRender(@Req() req) {
        return this.adminService.addAdmin(
            req.flash('loginError'),
            req.cookies['Admin'],
        );
    }

    @Get('delete')
    @Render('deleteAdmins')
    async deleteRender(@Req() req) {
        return this.adminService.deleteAdmin(
            req.flash('loginError'),
            req.cookies['Admin'],
        );
    }

    @Get('support')
    @Render('adminSupport')
    async supportRender(@Req() req) {
        return this.adminService.supportAdmin(
            req.flash('loginError'),
            req.cookies['Admin'],
        );
    }

    @Get('logout')
    async logout(@Res() res: Response) {
        res.clearCookie('Admin');
        res.redirect('/admin/login');
    }


    @Post('login')
    @UseGuards(AuthGuard('admin'))
    async login(@Req() request, @Res() res: Response) {
        if (typeof request.user === 'object') {
            res.cookie('Admin', request.user._id);
            res.redirect(`/admin/login/${request.user._id}`);
        }
        request.flash('loginError', request.user);
        res.redirect('/admin/login');
    }

    @Post('add')
    async addAdmin(
        @Body() dto: AdminDto,
        @Req() request,
        @Res() res: Response) {
        const status = await this.adminService.register(dto);
        if (status === 'good') {
            return res.redirect(`/admin/login/${request.cookies['Admin']}`);
        } else {
            request.flash('registerError', status);
            res.redirect(`/admin/login/${request.cookies['Admin']}`);
        }
    }

    @Get('login/:_id')
    @Render('admin')
    async renderAdmin(@Req() req) {
        return this.adminService.renderAdmin(
            req.cookies['Admin']
        );
    }


    @Get('unbanned/:_id')
    async unbanUser(@Req() req, @Res() res: Response, @Param() userId) {
        await this.adminService.unbanUser(userId._id);
        res.redirect(`/admin/login/${req.cookies['Admin']}`)
    }




    @Get('banned/:_id')
    async banUser(@Req() req, @Res() res: Response, @Param() userId) {
        await this.adminService.banUser(userId._id);
        res.redirect(`/admin/login/${req.cookies['Admin']}`)
    }

    @Get('delete/:_id')
    async delete(@Req() req, @Res() res: Response, @Param() userId) {
        await this.adminService.delete(userId._id);
        res.redirect(`/admin/login/${req.cookies['Admin']}`)
    }

}

