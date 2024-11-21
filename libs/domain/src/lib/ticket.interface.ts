import { IConcert } from "./concert.interface";

export interface ITicket {
    id?: string;
    concert: IConcert;
    purchaseDateAndTime: Date;
    used: boolean;
}