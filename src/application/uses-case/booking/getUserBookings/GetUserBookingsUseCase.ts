import { IBookingRepository } from 'src/domain/repositories/IbookingRepository';
import { Booking } from 'src/domain/entities/booking/Booking';
import { GetUserBookingsDto } from './GetUserBookingsDto';

export class GetUserBookingsUseCase {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(dto: GetUserBookingsDto): Promise<Booking[]> {
    const bookings = await this.bookingRepository.findAll();
    
    // Filtrer par userId
    return bookings.filter(booking => booking.userId === dto.userId);
  }
}
