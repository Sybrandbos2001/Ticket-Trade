export interface ITicket {
    id: string;
    userId: string;
    locationId: string;
    purchaseDate: Date;
    used: boolean;
}