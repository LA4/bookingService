import { BookingStatus } from "../value-objects/bookingStatus";
import { Ticket } from "./Ticket";

export class Booking {
    private constructor(
        public readonly id: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly status: BookingStatus,
        public readonly totalPrice: number,
        public readonly userId: string,
        public readonly showtimeId: string,
        public readonly tickets: Ticket[],
    ) {
    }
    public static create(
        id: string,
        createdAt: Date,
        updatedAt: Date | null,
        status: BookingStatus,
        totalPrice: number,
        userId: string,
        showtimeId: string,
        tickets: Ticket[],
    ) {
        return new Booking(
            id,
            createdAt,
            updatedAt,
            status,
            totalPrice,
            userId,
            showtimeId,
            tickets
        )
    }
}
