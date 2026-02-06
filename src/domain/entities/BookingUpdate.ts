import { BookingStatus } from "src/domain/ValueObject/BookingStatus";

export class BookingUpdate {
    constructor(
    private readonly updatedAt: Date,
    public status: BookingStatus,
    public seatId: string,
    public readonly totalPrice: number,
    public readonly bookingId: string,
    ){

    }}