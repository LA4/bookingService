import { IBookingRepository } from 'src/domain/repositories/IbookingRepository';
import { Booking } from 'src/domain/entities/booking/Booking';

export class GetAllBookingsUseCase {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(): Promise<Booking[]> {
    return await this.bookingRepository.findAll();
  }
}
