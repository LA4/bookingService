export class UpdateTicketDto {
  constructor(
    public readonly ticketId: string,
    public readonly userId: string,
    public readonly price?: number,
    public readonly seatIds?: string[],
    public readonly seatLabel?: string | null
  ) {}
}
