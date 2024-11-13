import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const RoomConfig = pgTable('RoomConfig', {
	roomId: text('roomId').notNull().primaryKey(),
	maxOccupancy: integer('maxOccupancy').notNull()
});

export const Booking = pgTable('bookings', {
	bookingId: text('bookingId').notNull().primaryKey(),
	roomId: text('roomId').notNull(),
	userId: text('userId').notNull(),
	checkIn: timestamp('checkIn', { precision: 3 }).notNull(),
	checkOut: timestamp('checkOut', { precision: 3 }).notNull(),
	checkInTime: timestamp('checkInTime', { precision: 3 }),
	checkOutTime: timestamp('checkOutTime', { precision: 3 })
});