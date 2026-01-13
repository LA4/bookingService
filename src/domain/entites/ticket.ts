export class Ticket {
    private constructor(
        private readonly id: string,
        private readonly price: number,
        private readonly seatId: string,
        private readonly seatLabel: string,
        private readonly showtimeId: string,
        private readonly bookingId: string,
    ) {

    }
}   