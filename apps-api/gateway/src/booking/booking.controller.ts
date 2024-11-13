import {
  BOOKING_RESERVE_SERVICE_NAME,
  BookingReserveServiceClient,
} from '@jong-hong/grpc/nestjs/proto/booking/reserve';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import { Consumer, Kafka, Producer } from 'kafkajs';
import { lastValueFrom, Subject } from 'rxjs';

import { environment } from '../enviroment';
import { getProfile } from '../utils/profile';

@Controller('booking')
export class BookingController {
  kafka: Kafka;
  consumer: Consumer;
  publisher: Producer;

  bookingReserveServiceClient: BookingReserveServiceClient;

  idToSubject = new Map<string, Subject<any>>();

  constructor(
    @Inject(BOOKING_RESERVE_SERVICE_NAME)
    private bookingClient: ClientGrpc,
  ) {
    this.kafka = new Kafka({
      clientId: 'gateway-booking-service',
      brokers: [environment.MESSAGE_BROKER_URL],
    });
    this.consumer = this.kafka.consumer({
      groupId: 'gateway-booking-service',
    });
    this.publisher = this.kafka.producer();
  }

  async onModuleInit() {
    this.bookingReserveServiceClient =
      this.bookingClient.getService<BookingReserveServiceClient>(
        BOOKING_RESERVE_SERVICE_NAME,
      );

    await this.consumer.connect();
    await this.publisher.connect();
    await this.consumer.subscribe({
      topics: ['booking.requested.success', 'booking.requested.failed'],
    });

    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (topic === 'booking.requested.success') {
          const {
            data: { bookingId },
          } = JSON.parse(message.value.toString());
          const subject = this.idToSubject.get(bookingId);
          console.log(bookingId, subject);
          subject.next({ bookingId });
        } else if (topic === 'booking.requested.failed') {
          console.log('Booking failed');
        }
      },
    });
  }

  @Post()
  async createBooking(
    @Body() body: { roomId: string; checkIn: string; checkOut: string },
    @Req() req,
  ) {
    const subject = new Subject();
    const bookingId = randomUUID();
    this.idToSubject.set(bookingId, subject);

    const profile = await getProfile(req);
    console.log('profile', profile, bookingId);
    this.publisher.send({
      topic: 'booking.requested',
      messages: [
        {
          value: JSON.stringify({
            roomId: body.roomId,
            userId: profile._id,
            bookingId,
            checkIn: body.checkIn,
            checkOut: body.checkOut,
          }),
        },
      ],
    });

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('Booking failed');
      }, 5000);
      subject.subscribe({
        next: (value) => {
          resolve(value);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  @Get('/room/:roomId')
  async getRoom(@Param('roomId') roomId: string) {
    return lastValueFrom(
      this.bookingReserveServiceClient.getRoomBookings({
        roomId,
      }),
    );
  }

  @Get('/')
  async getBooking(@Req() req) {
    const profile = await getProfile(req);
    return lastValueFrom(
      this.bookingReserveServiceClient.getUserBookings({
        userId: profile._id,
      }),
    );
  }
}