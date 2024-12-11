export interface CreateConcertDto {
  name: string;
  price: number;
  startDateAndTime: Date;
  endDateAndTime: Date;
  amountTickets: number;
  locationId: string;
  artistId: string;
}