import { IsString, IsNotEmpty  } from 'class-validator';

export class AdminDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    paramiters: string;

    @IsString()
    @IsNotEmpty()
    glb_upload: string;

    @IsString()
    @IsNotEmpty()
    preview: string;
}
