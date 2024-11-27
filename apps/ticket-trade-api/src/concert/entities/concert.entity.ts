import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IConcert } from '@ticket-trade/domain'; 
import { Artist, ArtistSchema } from '../../artist/entities/artist.entity';
import { Location, LocationSchema } from '../../location/entities/location.entity';
import { ApiProperty } from '@nestjs/swagger';

export type ConcertDocument = Concert & Document;

@Schema()
export class Concert extends Document implements IConcert {

    // DB is responsible for ID

    @ApiProperty({ example: 'Post Malone Presents - The BIG ASS Stadium Tour', description: 'Name of concert' })
    @Prop({ required: true })
    name: string;

    @ApiProperty({ example: '60.0', description: 'Price of concert' })
    @Prop({ required: true })
    price: number;

    @ApiProperty({ example: '2024-12-15T19:30:00Z', description: 'Start date and time of concert, format: ISO 8601 (UTC)' })
    @Prop({ required: true })
    startDateAndTime: Date;

    @ApiProperty({ example: '2024-12-15T22:30:00Z', description: 'End date and time of concert, format: ISO 8601 (UTC)' })
    @Prop({ required: true })
    endDateAndTime: Date;

    @ApiProperty({ example: '5000', description: 'Amount of tickets for concert' })
    @Prop({ required: true })
    amountTickets: number;

    @ApiProperty({
        example: {
          name: "Post Malone",
          description: "Post Malone, geboren als Austin Richard Post, is een Amerikaanse zanger en muziekproducent."
        },
        description: "Details of the artist performing at the concert"
      })
    @Prop({ type: ArtistSchema, required: true })
    artist: Artist;  

    @ApiProperty({
        example: {
          street: "Kerkstraat",
          houseNumber: "1A",
          postalcode: "4811AB",
          city: "Arnhem",
          country: "Nederland",
          name: "GelreDome",
        },
        description: "Details of the location where the concert is held"
      })
    @Prop({ type: LocationSchema, required: true }) 
    location: Location;  
}

export const ConcertSchema = SchemaFactory.createForClass(Concert);
