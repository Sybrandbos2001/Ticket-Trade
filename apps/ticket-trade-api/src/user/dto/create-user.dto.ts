import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword } from 'class-validator';
import { TicketSchema } from '../../ticket/entities/ticket.entity';
import { Prop } from '@nestjs/mongoose';
import { ITicket, IUser } from '@ticket-trade/domain';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto implements IUser {
    
    // DB is responsible for ID

    @ApiProperty({ example: 'John', description: 'Firstname of user' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Doe', description: 'Lastname of user' })
    @IsNotEmpty()
    @IsString()
    lastname: string;

    @ApiProperty({ example: 'johndoe', description: 'Username of user', uniqueItems: true })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ example: '+31 6 12345678', description: 'Phonenumber of user' })
    @IsNotEmpty()
    @IsPhoneNumber(null, { message: 'Use the following phone number format : +31 6 12345678' })
    phone: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'Emailadres of user' })
    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @ApiProperty({ example: 'Password@123', description: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character' })
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
    password: string;

    @Prop({ type: [TicketSchema], default: [] }) // Automatically set to an empty array for tickets
    tickets: ITicket[];
}
