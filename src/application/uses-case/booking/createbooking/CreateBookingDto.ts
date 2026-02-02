import { BookingStatus } from '../../../../domain/ValueObject/BookingStatus';

export class CreateBookingDto {
  public readonly userId: string;
  public readonly showtimeId: string;
  public readonly seatIds: string[];
  public readonly totalPrice: number;
  public readonly status: BookingStatus;
}
