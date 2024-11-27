import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IGenre } from "@ticket-trade/domain";
import { Document } from 'mongoose';

export type GenreDocument = Genre & Document;

@Schema()
export class Genre extends Document implements IGenre {
    
    // DB is responsible for ID

    @ApiProperty({ example: 'House', description: 'Name' })
    @Prop({ required: true })
    name: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
