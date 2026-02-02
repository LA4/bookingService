import { Booking } from './Booking';

export class Ticket {
  private constructor(
    public id: string,
    public price: number,
    public seatId: string,
    public seatLabel: string,
    public showtimeId: string,
    public bookingId: string,
    public booking: Booking
  ) {}

}