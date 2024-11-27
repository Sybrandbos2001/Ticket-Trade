import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ITicket } from '@ticket-trade/domain';
import { ApiProperty } from '@nestjs/swagger';
import { Concert, ConcertSchema } from '../../concert/entities/concert.entity';
import * as moment from 'moment-timezone';

export type TicketDocument = Ticket & Document;

@Schema()
export class Ticket extends Document implements ITicket {
  @ApiProperty({
    example: {
      name: "Post Malone Presents - The BIG ASS Stadium Tour",
      price: 60,
      startDateAndTime: "2024-12-15T19:30:00Z",
      endDateAndTime: "2024-12-15T22:30:00Z",
      amountTickets: 5000,
      artist: {
        name: "Post Malone",
        description:
          "Post Malone, geboren als Austin Richard Post, is een Amerikaanse zanger en muziekproducent.",
      },
      location: {
        street: "Kerkstraat",
        houseNumber: "1A",
        postalcode: "4811AB",
        city: "Arnhem",
        country: "Nederland",
        name: "GelreDome",
      },
    },
    description: "Details of the concert, including artist and location information",
  })
  @Prop({ type: ConcertSchema, required: true })
  concert: Concert;

  @ApiProperty({ example: '63e9b6f5c76a9a0017a2d4e8', description: 'ID of user' })
  @Prop({ type: String, required: true })
  userId: string;

  @ApiProperty({ example: '2024-11-26T20:30:00+01:00', description: 'Purchase date and time of the ticket' })
  @Prop({ type: Date, default: () => moment.tz('Europe/Amsterdam').toDate(), required: true })
  purchaseDateAndTime: Date;

  @ApiProperty({ example: false, description: 'Boolean indicating if the ticket has been scanned' })
  @Prop({ required: true, default: false })
  used: boolean;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
