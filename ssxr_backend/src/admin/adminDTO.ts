import {IsString, IsOptional, IsNumberString, IsNotEmpty,} from 'class-validator';

export class AdminDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    object_name: string;

    @IsOptional()
    @IsNumberString()
    width?: string;

    @IsOptional()
    @IsNumberString()
    height?: string;

    @IsOptional()
    @IsNumberString()
    length?: string;
}
