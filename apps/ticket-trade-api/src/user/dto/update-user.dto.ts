import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    
    @ApiProperty({ example: 'John', description: 'Firstname of user' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Doe', description: 'Lastname of user' })
    @IsNotEmpty()
    @IsString()
    lastname: string;

    @ApiProperty({ example: '+31 6 12345678', description: 'Phonenumber of user' })
    @IsNotEmpty()
    @IsPhoneNumber(null, { message: 'Use the following phone number format : +31 6 12345678' })
    phone: string;
}
