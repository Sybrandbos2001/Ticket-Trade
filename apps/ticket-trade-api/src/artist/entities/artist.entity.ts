import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IArtist } from '@ticket-trade/domain';

export class Artist extends Document implements IArtist {

    // DB is responsible for ID

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
