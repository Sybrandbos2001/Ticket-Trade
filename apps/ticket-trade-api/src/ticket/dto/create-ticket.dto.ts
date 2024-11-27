import { ApiProperty } from "@nestjs/swagger";
import { ITicket } from "@ticket-trade/domain";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTicketDto implements ITicket {
    
    // DB is responsible for ID
    
    @ApiProperty({ example: '63e9b6f5c76a9a0017a2d4e8', description: 'ID of the concert' })
    @IsNotEmpty()
    @IsString()
    concertId: string;
}
