import { Injectable, Inject } from '@nestjs/common';
import { IBookingRepository } from 'src/domain/repositories/IbookingRepository';
import { DeleteBookingDto } from './DeleteBookingDto';
import { BOOKING_REPOSITORY } from 'src/domain/repositories/tokens';

@Injectable()
export class DeleteBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository
  ) {}

  async execute(dto: DeleteBookingDto): Promise<void> {
    const booking = await this.bookingRepository.findById(dto.bookingId);

    if (!booking) {
      throw new Error(`Booking with id ${dto.bookingId} not found`);
    }

    // Vérifier que l'utilisateur est bien le propriétaire
    if (booking.userId !== dto.userId) {
      throw new Error('Unauthorized: You can only delete your own bookings');
    }

    await this.bookingRepository.delete(dto.bookingId);
  }
}
