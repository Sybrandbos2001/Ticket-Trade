import { ApiProperty } from "@nestjs/swagger";
import { IArtist } from "@ticket-trade/domain";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateArtistDto implements IArtist {

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
