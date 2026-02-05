import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTicketRequestSwagger {
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

  @ApiProperty({ description: 'Booking ID', example: 'booking-789' })
  bookingId: string;
}

export class UpdateTicketRequestSwagger {
  @ApiProperty({ description: 'User ID', example: 'user-123' })
  userId: string;

  @ApiPropertyOptional({ description: 'Updated price', example: 15.00 })
  price?: number;

  @ApiPropertyOptional({ description: 'Updated seat IDs', example: ['B2'], type: [String] })
  seatIds?: string[];

  @ApiPropertyOptional({ description: 'Updated seat label', example: 'Seat B2', nullable: true })
  seatLabel?: string | null;
}

export class DeleteTicketRequestSwagger {
  @ApiProperty({ description: 'User ID of the ticket owner', example: 'user-123' })
  userId: string;
}
