import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus } from 'src/domain/ValueObject/BookingStatus';

export class TicketRequestSwagger {
  @ApiProperty({ description: 'Ticket price', example: 12.75 })
  price: number;

  @ApiProperty({ description: 'Seat IDs', example: ['A1'], type: [String] })
  seatIds: string[];

  @ApiPropertyOptional({ description: 'Seat label', example: 'Seat A1', nullable: true })
  seatLabel?: string | null;

  @ApiProperty({ description: 'Showtime ID', example: 'show-456' })
  showtimeId: string;

  @ApiProperty({ description: 'User ID', example: 'user-123' })
  userId: string;
}

export class CreateBookingRequestSwagger {
  @ApiProperty({ description: 'User ID', example: 'user-123' })
  userId: string;

  @ApiProperty({ description: 'Showtime ID', example: 'show-456' })
  showtimeId: string;

  @ApiProperty({ description: 'Array of seat IDs', example: ['A1', 'A2'], type: [String] })
  seatIds: string[];

  @ApiProperty({ description: 'Total price', example: 25.50 })
  totalPrice: number;

  @ApiProperty({ description: 'Tickets for the booking', type: [TicketRequestSwagger] })
  tickets: TicketRequestSwagger[];
}

export class UpdateBookingRequestSwagger {
  @ApiPropertyOptional({ description: 'Booking status', enum: BookingStatus, example: BookingStatus.CONFIRMED })
  status?: BookingStatus;

  @ApiPropertyOptional({ description: 'Updated seat IDs', example: ['A3', 'A4'], type: [String] })
  seatIds?: string[];
}

export class CancelBookingRequestSwagger {
  @ApiProperty({ description: 'User ID of the booking owner', example: 'user-123' })
  userId: string;
}

export class RefundBookingRequestSwagger {
  @ApiProperty({ description: 'User ID of the booking owner', example: 'user-123' })
  userId: string;
}

export class DeleteBookingRequestSwagger {
  @ApiProperty({ description: 'User ID of the booking owner', example: 'user-123' })
  userId: string;
}
