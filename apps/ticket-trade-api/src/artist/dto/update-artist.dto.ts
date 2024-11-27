import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateArtistDto } from './create-artist.dto';
import { PartialType } from '@nestjs/mapped-types';


export class UpdateArtistDto extends PartialType(CreateArtistDto) {

    // DB is responsible for ID

    @ApiProperty({ example: 'Post Malone', description: 'Name' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Post Malone, geboren als Austin Richard Post, is een Amerikaanse zanger en muziekproducent.', description: 'Description' })
    @IsNotEmpty()
    @IsString()
    description: string;
}