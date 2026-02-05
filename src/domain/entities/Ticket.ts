export class Ticket {
  constructor(
    public readonly id: string,
    public readonly price: number,
    public readonly seatIds: string[],
    public readonly seatLabel: string | null,
    public readonly showtimeId: string,
    public readonly userId: string,
    public readonly bookingId?: string
  ) {}
}