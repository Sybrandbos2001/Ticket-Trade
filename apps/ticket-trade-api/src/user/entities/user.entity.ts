import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Ticket, TicketSchema } from '../../ticket/entities/ticket.entity';
import { IUser, Role } from '@ticket-trade/domain';


export type UserDocument = User & Document;

@Schema()
export class User extends Document implements IUser {

    // DB is responsible for ID

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    lastname: string;

    @Prop({ required: true, unique: true }) // Username has to be unique
    username: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true, unique: true }) // Email has to be unique
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: String, enum: Role,  default: Role.USER }) // Default role is USER
    role: Role;
    
    @Prop({ type: [TicketSchema], default: [] }) // Array of tickets for quick querying
    tickets: Ticket[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] })
    following: string[]; // Array van User IDs
}

export const UserSchema = SchemaFactory.createForClass(User);