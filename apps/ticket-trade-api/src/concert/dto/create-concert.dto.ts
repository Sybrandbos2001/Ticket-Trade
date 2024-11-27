import { ApiProperty } from "@nestjs/swagger";
import { IConcert } from "@ticket-trade/domain";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateConcertDto implements IConcert {

    // DB is responsible for ID

    @ApiProperty({ example: 'Post Malone Presents - The BIG ASS Stadium Tour', description: 'Name of concert' })
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @ApiProperty({ example: '60.0', description: 'Price of concert' })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({ example: '2024-12-15T19:30:00Z', description: 'Start date and time of concert, format: ISO 8601 (UTC)' })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    startDateAndTime: Date;

    @ApiProperty({ example: '2024-12-15T22:30:00Z', description: 'End date and time of concert, format: ISO 8601 (UTC)' })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    endDateAndTime: Date;

    @ApiProperty({ example: '15000', description: 'Amount of tickets for concert' })
    @IsNotEmpty()
    @IsNumber()
    amountTickets: number;

    @ApiProperty({ example: '63e9b6f5c76a9a0017a2d4e8', description: 'ID of the location' })
    @IsNotEmpty()
    @IsString()
    locationId: string;

    @ApiProperty({ example: '63e9b6f5c76a9a0017a2d4e7', description: 'ID of the artist' })
    @IsNotEmpty()
    @IsString()
    artistId: string;
}
