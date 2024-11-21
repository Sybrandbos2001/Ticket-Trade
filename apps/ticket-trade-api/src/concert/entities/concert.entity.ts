import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IConcert } from '@ticket-trade/domain'; 
import { Artist, ArtistSchema } from '../../artist/entities/artist.entity';
import { Location, LocationSchema } from '../../location/entities/location.entity';

@Schema()
export class Concert extends Document implements IConcert {

    // DB is responsible for ID

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    startDateAndTime: Date;

    @Prop({ required: true })
    endDateAndTime: Date;

    @Prop({ required: true })
    amountTickets: number;

    @Prop({ type: ArtistSchema, required: true })
    artist: Artist;  

    @Prop({ type: LocationSchema, required: true }) 
    location: Location;  
}

export const ConcertSchema = SchemaFactory.createForClass(Concert);
