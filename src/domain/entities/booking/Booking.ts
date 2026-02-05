
import { BookingStatus } from 'src/domain/ValueObject/BookingStatus';
import { v4 as uuid } from 'uuid';
import { Ticket } from '../Ticket';

export class Booking {
  private constructor(
    public readonly id: string,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
    public status: BookingStatus,
    public seatIds: string[],
    public readonly totalPrice: number,
    public readonly userId: string,
    public readonly showtimeId: string,
    public readonly tickets: Ticket[],
  ) {}

  // public static updateBoking(booking: BookingUpdate): Booking {
  //   if (!booking.id || !booking.createdAt || !booking.updatedAt || !booking.status || !booking.seatId || !booking.totalPrice || !booking.userId || !booking.showtimeId || !booking.tickets) {
  //     throw new Error('Missing required booking information');
  //   }

  //   return new Booking(
  //     booking.id,
  //     booking.createdAt,
  //     new Date(),
  //     booking.status,
  //     booking.seatId,
  //     booking.totalPrice,
  //     booking.userId,
  //     booking.showtimeId,
  //     booking.tickets,
  //   );
  // }

  public static createBooking(bookingInfos: Booking): Booking {

    if (!bookingInfos.totalPrice || !bookingInfos.userId || !bookingInfos.showtimeId || !bookingInfos.tickets) {
      throw new Error('Missing required booking information');
    }

    return new Booking(
      bookingInfos.id || uuid(),
      new Date(),
      new Date(),
      BookingStatus.PENDING,
      bookingInfos.seatIds,
      bookingInfos.totalPrice,
      bookingInfos.userId,
      bookingInfos.showtimeId,
      bookingInfos.tickets,
    );
  }
}
