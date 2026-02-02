import { CreateBookingDto } from './CreateBookingDto';
import { IBookingRepository } from '../../../../domain/repositories/IbookingRepository';
import { Booking } from '../../../../domain/entities/Booking';

export class CreateBookingUseCase {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(dto: CreateBookingDto): Promise<void> {
    const booking =  Booking.createBooking({

    });
  }
}