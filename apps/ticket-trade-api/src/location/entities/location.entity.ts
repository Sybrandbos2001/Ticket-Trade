import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ILocation } from '@ticket-trade/domain';

@Schema()
export class Location extends Document implements ILocation {

    // DB is responsible for ID

    @Prop({ required: true })
    street: string;

    @Prop({ required: true })
    houseNumber: string;

    @Prop({ required: true })
    postalcode: string;

    @Prop({ required: true })
    country: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    city: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
