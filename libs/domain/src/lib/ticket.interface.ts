import { IConcert } from "./concert.interface";

export interface ITicket {
    id?: string;
    userId?: string;
    concert?: IConcert;
    concertId?: string;
    purchaseDateAndTime?: Date;
    used?: boolean;
}