export class DeleteTicketDto {
  constructor(
    public readonly ticketId: string,
    public readonly userId: string
  ) {}
}
