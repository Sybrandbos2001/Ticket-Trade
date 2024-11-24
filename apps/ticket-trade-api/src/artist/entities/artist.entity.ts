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

    @ApiProperty({ example: 'Post Malone, artiestennaam van Austin Richard Post, is een Amerikaanse zanger, songwriter, muziekproducent en gitarist. Op de middelbare school experimenteerde hij al met muziek. Hij zat in een heavymetalband en maakte op zijn zestiende een mixtape met het audioprogramma FL Studio.', description: 'Description' })
    @Prop({ required: true })
    description: string;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
