import { IBookingRepository } from 'src/domain/repositories/IbookingRepository';
import { Booking } from 'src/domain/entities/booking/Booking';
import { GetBookingByIdDto } from './GetBookingByIdDto';

export class GetBookingByIdUseCase {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(dto: GetBookingByIdDto): Promise<Booking> {
    const booking = await this.bookingRepository.findById(dto.bookingId);

    if (!booking) {
      throw new Error(`Booking with id ${dto.bookingId} not found`);
    }

    return booking;
  }
}
