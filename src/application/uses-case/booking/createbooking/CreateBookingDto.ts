import { BookingStatus } from "src/domain/value-objects/bookingStatus";

export class CreateBookingDto {
    public readonly userId: string;
    public readonly showtimeId: string;
    public readonly seatIds: string[];
    public readonly totalPrice: number;
    public readonly status: BookingStatus;
}