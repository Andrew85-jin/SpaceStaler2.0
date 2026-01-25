import {Body, Controller, Get, Post, Put, Delete} from '@nestjs/common';
import {AdminService} from "./admin.service";
import {AdminDto} from "./adminDTO";
import { Admin } from "./admin.entity";


@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get()
    getAllData(){
        return this.adminService.getAllData()
    }

    @Post()
    async setAllData(@Body() body: AdminDto): Promise<Admin> {
        return this.adminService.setAllData(body);
    }

    @Delete('reset')
    async resetTable() {
        await this.adminService.resetAdminTable();
        return { message: 'Admin table reset successfully' };
    }
}
