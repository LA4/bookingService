export class TicketResponse {
  id: string;
  price: number;
  seatIds: string[];
  seatLabel: string | null;
  showtimeId: string;
  userId: string;
  bookingId?: string;
}
