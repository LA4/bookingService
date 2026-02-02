import { BookingStatus } from '../ValueObject/BookingStatus';
import { Ticket } from './Ticket';
import { v4 as uuid } from 'uuid';

export class Booking {
  private constructor(
    public id: string,
    private createdAt: Date,
    private updatedAt: Date,
    public status: BookingStatus,
    public totalPrice: number,
    public userId: string,
    public showtimeId: string,
    public tickets: Ticket[],
  ) {}

  public static createBooking(bookingInfos: Booking): Booking {
    return new Booking(
      bookingInfos.id || uuid(),
      bookingInfos.createdAt,
      bookingInfos.updatedAt,
      bookingInfos.status,
      bookingInfos.totalPrice,
      bookingInfos.userId,
      bookingInfos.showtimeId,
      bookingInfos.tickets,
    );
  }
}
