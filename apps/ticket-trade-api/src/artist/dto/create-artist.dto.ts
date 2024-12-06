import { ApiProperty } from "@nestjs/swagger";
import { IArtist } from "@ticket-trade/domain";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateArtistDto implements IArtist {

    // DB is responsible for ID

    @ApiProperty({ example: 'Post Malone', description: 'Name' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Post Malone, geboren als Austin Richard Post, is een Amerikaanse zanger en muziekproducent.', description: 'Description' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ example: '63e9b6f5c76a9a0017a2d4e8', description: 'ID of genre' })
    @IsNotEmpty()
    @IsString()
    genreId: string;
}
