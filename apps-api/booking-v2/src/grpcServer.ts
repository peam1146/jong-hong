import {
  BookingReserveServiceImplementation,
  DeepPartial,
  GetRoomBookingsRequest,
  GetRoomBookingsResponse,
  GetRoomDetailsRequest,
  GetRoomDetailsResponse,
  GetUserBookingsRequest,
  GetUserBookingsResponse,
} from '@jong-hong/grpc/ts/proto/booking/reserve'

import { Db } from './databaes'

import { Booking } from '../drizzle/schema'

export class BookingReserveServiceServer implements BookingReserveServiceImplementation {
  constructor(private db: Db) {}

  async getUserBookings({
    userId,
  }: GetUserBookingsRequest): Promise<DeepPartial<GetUserBookingsResponse>> {
    const bookings = await this.db.query.Booking.findMany({
      where: (t, { eq }) => eq(t.userId, userId),
      orderBy: Booking.checkIn,
    })
    return {
      bookings: bookings.map((booking) => ({
        bookingId: booking.bookingId,
        roomId: booking.roomId,
        checkIn: booking.checkIn.toISOString(),
        checkOut: booking.checkOut.toISOString(),
      })),
    }
  }
  async getRoomBookings(
    request: GetRoomBookingsRequest
  ): Promise<DeepPartial<GetRoomBookingsResponse>> {
    const bookings = await this.db.query.Booking.findMany({
      where: (t, { eq }) => eq(t.roomId, request.roomId),
      orderBy: Booking.checkIn,
    })
    return {
      bookings: bookings.map((booking) => ({
        bookingId: booking.bookingId,
        userId: booking.userId,
        checkIn: booking.checkIn.toISOString(),
        checkOut: booking.checkOut.toISOString(),
      })),
    }
  }

  async getRoomDetails({
    roomId,
  }: GetRoomDetailsRequest): Promise<DeepPartial<GetRoomDetailsResponse>> {
    const result = await this.db.query.RoomConfig.findFirst({
      where: (t, { eq }) => eq(t.roomId, roomId),
      columns: {
        maxOccupancy: true,
      },
    })
    if (!result) {
      throw new Error('Room not found')
    }
    return {
      roomId,
      capacity: result.maxOccupancy,
    }
  }
}
