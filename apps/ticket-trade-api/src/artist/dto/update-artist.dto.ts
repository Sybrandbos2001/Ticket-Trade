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

    @ApiProperty({ example: 'Post Malone, artiestennaam van Austin Richard Post, is een Amerikaanse zanger, songwriter, muziekproducent en gitarist. Op de middelbare school experimenteerde hij al met muziek. Hij zat in een heavymetalband en maakte op zijn zestiende een mixtape met het audioprogramma FL Studio.', description: 'Description' })
    @IsNotEmpty()
    @IsString()
    description: string;
}