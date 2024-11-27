import { PartialType } from '@nestjs/mapped-types';
import { CreateGenreDto } from './create-genre.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateGenreDto extends PartialType(CreateGenreDto) {

    // DB is responsible for ID

    @ApiProperty({ example: 'House', description: 'Name' })
    @IsNotEmpty()
    @IsString()
    name: string;
}
