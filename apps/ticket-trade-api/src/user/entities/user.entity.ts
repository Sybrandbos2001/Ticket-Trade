import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Ticket, TicketSchema } from '../../ticket/entities/ticket.entity';
import { IUser, Role } from '@ticket-trade/domain';
import { ApiProperty } from '@nestjs/swagger';


export type UserDocument = User & Document;

@Schema()
export class User extends Document implements IUser {

    // DB is responsible for ID

    @ApiProperty({ example: 'John', description: 'Firstname of user' })
    @Prop({ required: true })
    name: string;

    @ApiProperty({ example: 'Doe', description: 'Lastname of user' })
    @Prop({ required: true })
    lastname: string;

    @ApiProperty({ example: 'johndoe', description: 'Username of user', uniqueItems: true })
    @Prop({ required: true, unique: true }) // Username has to be unique
    username: string;

    @ApiProperty({ example: '+31 6 12345678', description: 'Phonenumber of user' })
    @Prop({ required: true })
    phone: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'Emailadres of user', uniqueItems: true })
    @Prop({ required: true, unique: true }) // Email has to be unique
    email: string;

    @ApiProperty({ example: 'Password@123', description: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character' })
    @Prop({ required: true })
    password: string;

    @ApiProperty({ example: 'user', description: 'Role of user', default: Role.USER }) // Default role is USER
    @Prop({ type: String, enum: Role,  default: Role.USER }) // Default role is USER
    role: Role;
    
    @Prop({ type: [TicketSchema], default: [] }) // Array of tickets for quick querying
    tickets: Ticket[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] })
    following: string[]; // Array van User IDs
}

export const UserSchema = SchemaFactory.createForClass(User);