import { and, eq } from 'drizzle-orm'
import { Kafka } from 'kafkajs'
import * as v from 'valibot'

import { db } from './databaes'
import { env } from './env'

import { Booking } from '../drizzle/schema'

const kafka = new Kafka({
  clientId: 'booking-service',
  brokers: [env.KAFKA_BROKERS],
})

const TopicMap = {
  BOOKING_REQUESTED_SUCCESS_TOPIC: 'booking.requested.success',
  BOOKING_REQUESTED_FAILED_TOPIC: 'booking.requested.failed',
  BOOKING_CANCELED_SUCCESS_TOPIC: 'booking.canceled.success',
  BOOKING_CANCELED_FAILED_TOPIC: 'booking.canceled.failed',
  BOOKING_CHECK_IN_SUCCESS_TOPIC: 'booking.checkin.success',
  BOOKING_CHECK_OUT_SUCCESS_TOPIC: 'booking.checkout.success',
} as const

const SubscribedTopics = {
  BOOKING_REQUESTED_TOPIC: 'booking.requested',
  BOOKING_CANCELED_TOPIC: 'booking.canceled',
  BOOKING_CHECK_IN_TOPIC: 'booking.checkin',
  BOOKING_CHECK_OUT_TOPIC: 'booking.checkout',
} as const

const consumer = kafka.consumer({ groupId: 'booking-group' })
const publisher = kafka.producer()

const BookingRequested = v.object({
  roomId: v.string(),
  userId: v.string(),
  bookingId: v.string(),
  checkIn: v.pipe(
    v.string(),
    v.isoTimestamp(),
    v.transform((v) => new Date(v))
  ),
  checkOut: v.pipe(
    v.string(),
    v.isoTimestamp(),
    v.transform((v) => new Date(v))
  ),
})

const BookingCheckInRequested = v.object({
  userId: v.string(),
  bookingId: v.string(),
  roomId: v.string(),
})

const BookingCheckOutRequested = v.object({
  userId: v.string(),
  bookingId: v.string(),
})

// Example of BookingRequested

const BookingCanceled = v.object({
  bookingId: v.string(),
  userId: v.string(),
})

const Topic = v.enum(SubscribedTopics)

export const startKafkaConsumer = async () => {
  await consumer.connect()
  await publisher.connect()
  await consumer.subscribe({
    topics: Object.values(SubscribedTopics),
  })

  await consumer.run({
    eachMessage: async ({ topic: _topic, message }) => {
      const parsedTopic = await v.safeParseAsync(Topic, _topic)
      if (!parsedTopic.success) {
        console.log('not implemented topic', _topic)
        return
      }
      const topic = parsedTopic.output
      console.log(`Received topic: ${topic}, message: ${message.value?.toString('utf8')}`)
      try {
        if (message.value === null) return
        switch (topic) {
          case 'booking.requested':
            bookingRequested(message.value)
            break
          case 'booking.canceled':
            bookingCanceled(message.value)
            break
          case 'booking.checkin':
            bookingCheckIn(message.value)
            break
          case 'booking.checkout':
            bookingCheckOut(message.value)
            break
        }
      } catch (error) {
        console.error('Error processing Kafka message:', error)
      }
    },
  })

  return consumer
}

async function bookingCheckIn(payload: Buffer) {
  const parsed = await safeParseBuffer(BookingCheckInRequested, payload)
  if (!parsed.success) {
    return
  }

  try {
    await db
      .update(Booking)
      .set({
        checkInTime: new Date(),
        checkIn: new Date(),
      })
      .where(
        and(
          eq(Booking.bookingId, parsed.output.bookingId),
          eq(Booking.userId, parsed.output.userId)
        )
      )
    await publisher.send({
      topic: TopicMap.BOOKING_CHECK_IN_SUCCESS_TOPIC,
      messages: [
        {
          value: JSON.stringify({
            message: 'booking check in success',
            data: {
              bookingId: parsed.output.bookingId,
            },
          }),
        },
      ],
    })
  } catch (error) {
    return
  }

  await publisher.send({
    topic: TopicMap.BOOKING_CHECK_IN_SUCCESS_TOPIC,
    messages: [
      {
        value: JSON.stringify({
          message: 'booking check in success',
          data: {
            bookingId: parsed.output.bookingId,
          },
        }),
      },
    ],
  })
}

async function bookingCheckOut(payload: Buffer) {
  const parsed = await safeParseBuffer(BookingCheckOutRequested, payload)
  if (!parsed.success) {
    return
  }

  try {
    await db
      .update(Booking)
      .set({
        checkOutTime: new Date(),
      })
      .where(
        and(
          eq(Booking.bookingId, parsed.output.bookingId),
          eq(Booking.userId, parsed.output.userId)
        )
      )
    await publisher.send({
      topic: TopicMap.BOOKING_CHECK_OUT_SUCCESS_TOPIC,
      messages: [
        {
          value: JSON.stringify({
            message: 'booking check out success',
            data: {
              bookingId: parsed.output.bookingId,
            },
          }),
        },
      ],
    })
  } catch (error) {
    return
  }

  await publisher.send({
    topic: TopicMap.BOOKING_CHECK_IN_SUCCESS_TOPIC,
    messages: [
      {
        value: JSON.stringify({
          message: 'booking check in success',
          data: {
            bookingId: parsed.output.bookingId,
          },
        }),
      },
    ],
  })
}

async function bookingRequested(payload: Buffer) {
  const parsed = await safeParseBuffer(BookingRequested, payload)
  if (!parsed.success) {
    await publisher.send({
      topic: TopicMap.BOOKING_REQUESTED_FAILED_TOPIC,
      messages: [
        {
          value: JSON.stringify({
            message: 'parse payload fail',
            issue: parsed.issues,
          }),
        },
      ],
    })
    return
  }
  if (
    !(await isRoomAvailable(parsed.output.roomId, parsed.output.checkIn, parsed.output.checkOut))
  ) {
    await publisher.send({
      topic: TopicMap.BOOKING_REQUESTED_FAILED_TOPIC,
      messages: [
        {
          value: JSON.stringify({
            message: 'room is not available',
          }),
        },
      ],
    })
    return
  }

  try {
    await db.insert(Booking).values({
      bookingId: parsed.output.bookingId,
      roomId: parsed.output.roomId,
      userId: parsed.output.userId,
      checkIn: parsed.output.checkIn,
      checkOut: parsed.output.checkOut,
    })
  } catch (error) {
    await publisher.send({
      topic: TopicMap.BOOKING_REQUESTED_FAILED_TOPIC,
      messages: [
        {
          value: JSON.stringify({
            message: 'insert into database fail',
            issue: error,
          }),
        },
      ],
    })
    return
  }

  await publisher.send({
    topic: TopicMap.BOOKING_REQUESTED_SUCCESS_TOPIC,
    messages: [
      {
        value: JSON.stringify({
          message: 'booking request success',
          data: {
            bookingId: parsed.output.bookingId,
          },
        }),
      },
    ],
  })
}

async function bookingCanceled(payload: Buffer) {
  const parsed = await safeParseBuffer(BookingCanceled, payload)
  if (!parsed.success) {
    await publisher.send({
      topic: TopicMap.BOOKING_CANCELED_FAILED_TOPIC,
      messages: [
        {
          value: JSON.stringify({
            message: 'parse payload fail',
            issue: parsed.issues,
          }),
        },
      ],
    })
    return
  }

  try {
    await db
      .delete(Booking)
      .where(
        and(
          eq(Booking.bookingId, parsed.output.bookingId),
          eq(Booking.userId, parsed.output.userId)
        )
      )
  } catch (error) {
    await publisher.send({
      topic: TopicMap.BOOKING_CANCELED_FAILED_TOPIC,
      messages: [
        {
          value: JSON.stringify({
            message: 'delete from database fail',
            issue: error,
          }),
        },
      ],
    })
    return
  }

  await publisher.send({
    topic: TopicMap.BOOKING_CANCELED_SUCCESS_TOPIC,
    messages: [
      {
        value: JSON.stringify({
          message: 'booking canceled success',
          data: {
            bookingId: parsed.output.bookingId,
          },
        }),
      },
    ],
  })
}

async function isRoomAvailable(roomId: string, from: Date, to: Date) {
  const booking = db.query.Booking.findFirst({
    where: (t, { eq, lt, gt, and, or }) => {
      return and(
        eq(t.roomId, roomId),
        or(
          and(lt(t.checkIn, from), gt(t.checkOut, from)), // checkIn < from < checkOut
          and(lt(t.checkIn, to), gt(t.checkOut, to)) // checkIn < to < checkOut
        )
      )
    },
  })
  return !!booking
}

// NOTE: This will break if the schema not object
async function safeParseBuffer<
  const TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(schema: TSchema, input: Buffer): Promise<v.SafeParseResult<TSchema>> {
  return v.safeParseAsync(schema, JSON.parse(input.toString('utf8')))
}
