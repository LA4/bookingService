import { ITicketRepository } from "src/domain/repositories/ITicketRepository";
import { Ticket } from "src/domain/entites/Ticket";
import { CreateTicketDto } from "./CreateTicketDto";

export class CreateTicketUseCase {
    constructor(private readonly ticketRepository: ITicketRepository) { }

    async execute(dto: CreateTicketDto): Promise<void> {
        const ticket = Ticket.create(
            "",
            dto.price,
            dto.seatId,
            dto.seatLabel,
            dto.showtimeId,
            new Date(),
            ""
        );
        return this.ticketRepository.create(ticket);
    }
}