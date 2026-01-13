import { Ticket } from "./ticket";

export class Booking {
    private constructor(
        private readonly id: string,
        private readonly createdAt: Date,
        private readonly updatedAt: Date,
        private readonly status: string,
        private readonly totalPrice: number,
        private readonly userId: string,
        private readonly showtimeId: string,
        private readonly tickets: Ticket[],
    ) {
    }
}