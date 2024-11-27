import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ILocation } from '@ticket-trade/domain';
import { ApiProperty } from '@nestjs/swagger';

export type LocationDocument = Location & Document;

@Schema()
export class Location extends Document implements ILocation {

    // DB is responsible for ID

    @ApiProperty({ example: 'Kerkstraat', description: 'Streetname' })
    @Prop({ required: true })
    street: string;

    @ApiProperty({ example: '1A', description: 'Housenumber' })
    @Prop({ required: true })
    houseNumber: string;

    @ApiProperty({ example: '4811AB', description: 'Postalcode' })
    @Prop({ required: true })
    postalcode: string;

    @ApiProperty({ example: 'Nederland', description: 'Country' })
    @Prop({ required: true })
    country: string;

    @ApiProperty({ example: 'GelreDome', description: 'Name' })
    @Prop({ required: true })
    name: string;
    
    @ApiProperty({ example: 'Arnhem', description: 'City' })
    @Prop({ required: true })
    city: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
