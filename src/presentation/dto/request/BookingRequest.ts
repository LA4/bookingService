import { BookingStatus } from 'src/domain/ValueObject/BookingStatus';

export class CreateBookingRequest {
  userId: string;
  showtimeId: string;
  seatIds: string[];
  totalPrice: number;
  tickets: TicketRequest[];
}

export class TicketRequest {
  price: number;
  seatIds: string[];
  seatLabel?: string | null;
  showtimeId: string;
  userId: string;
}

export class UpdateBookingRequest {
  status?: BookingStatus;
  seatIds?: string[];
}

export class CancelBookingRequest {
  userId: string;
}

export class RefundBookingRequest {
  userId: string;
}

export class DeleteBookingRequest {
  userId: string;
}
