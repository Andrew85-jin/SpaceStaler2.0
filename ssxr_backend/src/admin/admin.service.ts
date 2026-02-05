import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Admin } from './admin.entity';
import { AdminDto } from './adminDTO';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>,
    ) {}

    async create(
        body: AdminDto,
        files: {
            model?: Express.Multer.File[];
            images?: Express.Multer.File[];
        },
    ): Promise<Admin> {
        const glbFile = files.model?.[0];
        const images = files.images || [];
        if (!glbFile) {
            throw new Error('GLB файл обязателен');
        }

        const admin = this.adminRepository.create({
            name: body.name,
            object_name: body.object_name,
            width: body.width ? Number(body.width) : null,
            height: body.height ? Number(body.height) : null,
            length: body.length ? Number(body.length) : null,
            glb_path: glbFile.path,
            images: images.map((img) => img.path),
            category: body.category,
        });

        return this.adminRepository.save(admin);
    }
}
