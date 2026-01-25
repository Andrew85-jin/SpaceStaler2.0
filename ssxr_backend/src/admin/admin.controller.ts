import {Controller, Post, Body, UploadedFiles, UseInterceptors,} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { AdminService } from './admin.service';
import { AdminDto } from './adminDTO';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post('upload')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'model', maxCount: 1 },
                { name: 'images', maxCount: 10 },
            ],
            {
                storage: diskStorage({
                    destination: './uploads',
                    filename: (_, file, cb) => {
                        const uniqueName =
                            Date.now() + '-' + Math.round(Math.random() * 1e9);
                        cb(null, uniqueName + extname(file.originalname));
                    },
                }),
            },
        ),
    )
    async upload(
        @Body() body: AdminDto,
        @UploadedFiles()
        files: {
            model?: Express.Multer.File[];
            images?: Express.Multer.File[];
        },
    ) {
        return this.adminService.create(body, files);
    }
}
