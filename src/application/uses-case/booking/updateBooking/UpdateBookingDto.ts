import { BookingStatus } from 'src/domain/ValueObject/BookingStatus';
import { Ticket } from 'src/domain/entities/Ticket';

export class UpdateBookingDto {
  constructor(
    public readonly bookingId: string,
    public readonly status?: BookingStatus,
    public readonly seatIds?: string[],
    public readonly tickets?: Ticket[]
  ) {}
}
