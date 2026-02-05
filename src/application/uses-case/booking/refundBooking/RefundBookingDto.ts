export class RefundBookingDto {
  constructor(
    public readonly bookingId: string,
    public readonly userId: string
  ) {}
}
