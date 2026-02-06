import { Injectable, Inject } from '@nestjs/common';
import { Booking } from 'src/domain/entities/Booking';
import { IBookingRepository } from 'src/domain/repositories/IbookingRepository';
import { BOOKING_REPOSITORY } from 'src/domain/repositories/tokens';

@Injectable()
export class GetAllBookingsUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository
  ) {}

  async execute(): Promise<Booking[]> {
    return await this.bookingRepository.findAll();
  }
}
