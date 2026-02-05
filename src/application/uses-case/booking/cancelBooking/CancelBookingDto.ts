export class CancelBookingDto {
  constructor(
    public readonly bookingId: string,
    public readonly userId: string
  ) {}
}
