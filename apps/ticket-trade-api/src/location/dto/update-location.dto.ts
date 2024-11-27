import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationDto } from './create-location.dto';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {
    
    // DB is responsible for ID

    @ApiProperty({ example: 'Kerkstraat', description: 'Streetname' })
    @IsNotEmpty()
    @IsString()
    street: string;

    @ApiProperty({ example: '1A', description: 'Housenumber' })
    @IsNotEmpty()
    @IsString()
    houseNumber: string;
    
    @ApiProperty({ example: '4811AB', description: 'Postalcode' })
    @IsNotEmpty()
    @IsString()
    postalcode: string;

    @ApiProperty({ example: 'Arnhem', description: 'City' })
    @IsNotEmpty()
    @IsString()
    city: string;
    
    @ApiProperty({ example: 'Nederland', description: 'Country' })
    @IsNotEmpty()
    @IsString()
    country: string;
    
    @ApiProperty({ example: 'GelreDome', description: 'Name' })
    @IsNotEmpty()
    @IsString()
    name: string;
}
