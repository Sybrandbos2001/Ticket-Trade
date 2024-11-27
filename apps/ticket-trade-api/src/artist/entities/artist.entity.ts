import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IArtist } from "@ticket-trade/domain";
import { Document } from 'mongoose';

export type ArtistDocument = Artist & Document;

@Schema()
export class Artist extends Document implements IArtist {

    // DB is responsible for ID

    @ApiProperty({ example: 'Post Malone', description: 'Name' })
    @Prop({ required: true })
    name: string;

    @ApiProperty({ example: 'Post Malone, geboren als Austin Richard Post, is een Amerikaanse zanger en muziekproducent.', description: 'Description' })
    @Prop({ required: true })
    description: string;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
