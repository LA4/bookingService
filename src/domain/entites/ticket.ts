export class Ticket {
    private constructor(
        private readonly id: string,
        private readonly price: number,
        private readonly seatId: string,
        private readonly seatLabel: string,
        private readonly showtimeId: string,
        private readonly createdAt: Date,
        private readonly bookingId: string,
    ) {

    }
    public static create(
        id: string,
        price: number,
        seatId: string,
        seatLabel: string,
        showtimeId: string,
        createdAt: Date,
        bookingId: string,
    ) {
        return new Ticket(
            id,
            price,
            seatId,
            seatLabel,
            showtimeId,
            createdAt,
            bookingId,
        )
    }
}