import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from 'class-validator';
import { Transform } from 'class-transformer';
import { TicketSchema } from '../../ticket/entities/ticket.entity';
import { Prop } from '@nestjs/mongoose';
import { ITicket, IUser, Role } from '@ticket-trade/domain';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class RegisterDto implements IUser {
    
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
    @Transform(({ value }) => value.toLowerCase())
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

    @ApiProperty({ example: 'user', description: 'Role of user', default: Role.USER }) // Default role is USER
    @IsOptional()
    @IsEnum(Role, { message: 'Role must be either user or admin' })
    role: Role;

    @Prop({ type: [TicketSchema], default: [] }) // Automatically set to an empty array for tickets
    tickets: ITicket[];

    @Prop({ type: [mongoose.Schema.Types.ObjectId], default: [] }) // Automatically set to an empty array for tickets
    following: string[];
}
