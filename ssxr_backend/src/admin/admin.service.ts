import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from "./admin.entity";
import {Repository} from "typeorm";
import {AdminDto} from "./adminDTO";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private adminRepository: Repository<Admin>
    ) {}

    getAllData(){
        return this.adminRepository.find()
    }

    async setAllData(body: AdminDto): Promise<Admin> {
        const admin = this.adminRepository.create(body)
        return this.adminRepository.save(admin);
    }

    async resetAdminTable(): Promise<void> {
        await this.adminRepository.query('TRUNCATE TABLE admin RESTART IDENTITY CASCADE;');
    }
}
