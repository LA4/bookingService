export class CreateTicketRequest {
  price: number;
  seatIds: string[];
  seatLabel?: string | null;
  showtimeId: string;
  userId: string;
  bookingId: string;
}

export class UpdateTicketRequest {
  userId: string;
  price?: number;
  seatIds?: string[];
  seatLabel?: string | null;
}

export class DeleteTicketRequest {
  userId: string;
}
