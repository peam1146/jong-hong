import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  BOOKING_HEALTH_SERVICE_NAME,
  BookingHealthServiceClient,
} from '@jong-hong/grpc/nestjs/proto/booking/health';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class HealthService implements OnModuleInit {
  private bookingHealthService: BookingHealthServiceClient;

  constructor(
    @Inject(BOOKING_HEALTH_SERVICE_NAME) private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.bookingHealthService =
      this.client.getService<BookingHealthServiceClient>(
        BOOKING_HEALTH_SERVICE_NAME,
      );
  }

  async pingBooking(message: string) {
    return lastValueFrom(this.bookingHealthService.ping({ message }));
  }
}
