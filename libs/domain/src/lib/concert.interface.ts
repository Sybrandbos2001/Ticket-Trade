import { IArtist } from "./artist.interface";
import { ILocation } from "./location.interface";

export interface IConcert {
    id?: string;
    name: string;
    price: number;
    startDateAndTime: Date;
    endDateAndTime: Date;
    amountTickets: number;
    location: ILocation;
    artist: IArtist;
}