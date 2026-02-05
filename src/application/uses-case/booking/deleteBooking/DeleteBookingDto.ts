export class DeleteBookingDto {
  constructor(
    public readonly bookingId: string,
    public readonly userId: string
  ) {}
}
