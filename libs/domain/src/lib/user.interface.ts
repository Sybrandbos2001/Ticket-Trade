import { Role } from "./role.enum";
import { ITicket } from "./ticket.interface";

export interface IUser {
    id?: string;
    name: string;
    lastname: string;
    username: string;
    phone: string;
    email: string;
    password: string;
    tickets: ITicket[];
    following: string[];
    role: Role;
}