import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ITicket } from '@ticket-trade/domain';
import { Concert, ConcertSchema } from '../../concert/entities/concert.entity';

@Schema()
export class Ticket extends Document implements ITicket {

    // DB is responsible for ID

    @Prop({ type: ConcertSchema, required: true }) 
    concert: Concert;  
    
    @Prop({ default: () => new Date(), required: true })
    purchaseDateAndTime: Date;

    @Prop({ required: true })
    used: boolean;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
