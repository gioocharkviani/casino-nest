import { Body, Controller, Get, Param, Post , Patch, Delete, Req, } from '@nestjs/common';
import { Request } from 'express';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/createnotifi.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/roles.enum';

@Controller('notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService , 
    ){}

    //GET ALL NOTIFICATION BY ROLED USER
    @Get()
    async getAllNotification(@Req() req:Request){
        return this.notificationService.getAllNotifications(req);
    }
    //GET ALL NOTIFICATION BY ROLED USER
    
    //GET CURRENT NOTIFICATION BY ID
    @Get(':id')
    async getById(@Param('id') id:number){
        return this.notificationService.getById(id);
    }
    //GET CURRENT NOTIFICATION BY ID


    // CREATE NOTIFICATION BY ACCESS ROLED USERS
    @Post('/create')
    @Roles(Role.ADMIN , Role.SUPER_ADMIN , Role.SUPPORT)
    async createNotification(@Req() req:Request , @Body() data : CreateNotificationDto) {
        return this.notificationService.createNotification(req,data);
    }
    // CREATE NOTIFICATION BY ACCESS ROLED USERS


     // UPDATE NOTIFICATION BY ACCESS ROLED USERS
     @Patch(':id')
     async readNotification(@Param('id') id:string){
         return this.notificationService.readNotification(id);
        }
    // UPDATE NOTIFICATION BY ACCESS ROLED USERS


     // REMOVE NOTIFICATION BY ACCESS ROLED USERS
     @Delete(':id')
     async removeNotification(@Param('id') id:string){
         return this.notificationService.removeNotification(id);
        }
    // REMOVE NOTIFICATION BY ACCESS ROLED USERS


}
