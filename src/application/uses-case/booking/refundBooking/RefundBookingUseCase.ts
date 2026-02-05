import { IBookingRepository } from 'src/domain/repositories/IbookingRepository';
import { BookingStatus } from 'src/domain/ValueObject/BookingStatus';
import { RefundBookingDto } from './RefundBookingDto';

export class RefundBookingUseCase {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(dto: RefundBookingDto): Promise<void> {
    const booking = await this.bookingRepository.findById(dto.bookingId);

    if (!booking) {
      throw new Error(`Booking with id ${dto.bookingId} not found`);
    }

    // Vérifier que l'utilisateur est bien le propriétaire
    if (booking.userId !== dto.userId) {
      throw new Error('Unauthorized: You can only refund your own bookings');
    }

    // Vérifier que la réservation peut être remboursée
    if (booking.status !== BookingStatus.CANCELLED) {
      throw new Error('Only cancelled bookings can be refunded');
    }

    // Mettre à jour le statut
    booking.status = BookingStatus.REFUNDED;

    await this.bookingRepository.update(booking);

    // TODO: Intégrer le service de paiement pour effectuer le remboursement réel
  }
}
