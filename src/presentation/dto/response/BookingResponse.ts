import { BookingStatus } from 'src/domain/ValueObject/BookingStatus';

export class BookingResponse {
  id: string;
  userId: string;
  showtimeId: string;
  status: BookingStatus;
  seatIds: string[];
  totalPrice: number;
  tickets: TicketResponse[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class TicketResponse {
  id: string;
  price: number;
  seatIds: string[];
  seatLabel: string | null;
  showtimeId: string;
  userId: string;
  bookingId?: string;
}

export class MessageResponse {
  message: string;
}
