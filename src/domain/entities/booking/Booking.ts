
import { BookingStatus } from 'src/domain/ValueObject/BookingStatus';
import { v4 as uuid } from 'uuid';
import { Ticket } from '../Ticket';

export class Booking {
  constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public status: BookingStatus,
    public seatIds: string[],
    public totalPrice: number,
    public readonly userId: string,
    public readonly showtimeId: string,
    public tickets: Ticket[],
  ) {}

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

  // Méthodes métier pour manipuler le booking
  public updateStatus(newStatus: BookingStatus): void {
    this.status = newStatus;
  }

  public updateSeats(newSeatIds: string[]): void {
    this.seatIds = newSeatIds;
  }

  public updateTickets(newTickets: Ticket[]): void {
    this.tickets = newTickets;
    // Recalculer le prix total
    this.totalPrice = newTickets.reduce((sum, ticket) => sum + ticket.price, 0);
  }
}
