import { Injectable, Inject } from '@nestjs/common';
import { IBookingRepository } from 'src/domain/repositories/IbookingRepository';
import { Booking } from 'src/domain/entities/Booking';
import { GetUserBookingsDto } from './GetUserBookingsDto';
import { BOOKING_REPOSITORY } from 'src/domain/repositories/tokens';

@Injectable()
export class GetUserBookingsUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository
  ) {}

  async execute(dto: GetUserBookingsDto): Promise<Booking[]> {
    const bookings = await this.bookingRepository.findAll();
    
    // Filtrer par userId
    return bookings.filter(booking => booking.userId === dto.userId);
  }
}
