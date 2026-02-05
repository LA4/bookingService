import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from 'src/domain/ValueObject/BookingStatus';

export class TicketResponseSwagger {
  @ApiProperty({ description: 'Ticket ID', example: 'ticket-uuid' })
  id: string;

  @ApiProperty({ description: 'Ticket price', example: 12.75 })
  price: number;

  @ApiProperty({ description: 'Seat IDs', example: ['A1'], type: [String] })
  seatIds: string[];

  @ApiProperty({ description: 'Seat label', example: 'Seat A1', nullable: true })
  seatLabel: string | null;

  @ApiProperty({ description: 'Showtime ID', example: 'show-456' })
  showtimeId: string;

  @ApiProperty({ description: 'User ID', example: 'user-123' })
  userId: string;

  @ApiProperty({ description: 'Booking ID', example: 'booking-789', required: false })
  bookingId?: string;
}

export class BookingResponseSwagger {
  @ApiProperty({ description: 'Booking ID', example: 'booking-uuid' })
  id: string;

  @ApiProperty({ description: 'User ID', example: 'user-123' })
  userId: string;

  @ApiProperty({ description: 'Showtime ID', example: 'show-456' })
  showtimeId: string;

  @ApiProperty({ description: 'Booking status', enum: BookingStatus, example: BookingStatus.CONFIRMED })
  status: BookingStatus;

  @ApiProperty({ description: 'Seat IDs', example: ['A1', 'A2'], type: [String] })
  seatIds: string[];

  @ApiProperty({ description: 'Total price', example: 25.50 })
  totalPrice: number;

  @ApiProperty({ description: 'Tickets', type: [TicketResponseSwagger] })
  tickets: TicketResponseSwagger[];

  @ApiProperty({ description: 'Created at', example: '2026-02-05T15:00:00Z' })
  createdAt?: Date;

  @ApiProperty({ description: 'Updated at', example: '2026-02-05T15:30:00Z' })
  updatedAt?: Date;
}

export class MessageResponseSwagger {
  @ApiProperty({ description: 'Success message', example: 'Booking confirmed successfully' })
  message: string;
}
