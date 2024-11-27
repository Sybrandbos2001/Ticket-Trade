import { ApiProperty } from "@nestjs/swagger";
import { IGenre } from "@ticket-trade/domain";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateGenreDto implements IGenre {
    
    // DB is responsible for ID

    @ApiProperty({ example: 'House', description: 'Name' })
    @IsNotEmpty()
    @IsString()
    name: string;
}
