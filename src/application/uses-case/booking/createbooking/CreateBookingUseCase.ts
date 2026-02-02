import { IBookingRepository } from "src/domain/repositories/IBookingRepository";
import { Booking } from "src/domain/entites/Booking";
import { BookingStatus } from "src/domain/value-objects/bookingStatus";
import { CreateBookingDto } from "./CreateBookingDto";
import { Ticket } from "src/domain/entites/Ticket";
import { CreateTicketUseCase } from "../../ticket/createTicket/CreateTicketUseCase";
export class CreateBookingUseCase {
    constructor(private readonly bookingRepository: IBookingRepository, private ticketUseCase: CreateTicketUseCase) { }

    async execute(dto: CreateBookingDto): Promise<void> {
        // vérifier que les tickest existent
        // lier les tickets au booking
        // créer le booking
        // mettre à jour les tickets
        // retourner le booking
    }


}