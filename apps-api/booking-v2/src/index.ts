import { BookingReserveServiceDefinition } from '@jong-hong/grpc/ts/proto/booking/reserve'
import { createServer } from 'nice-grpc'
import { HealthDefinition, HealthServiceImpl } from 'nice-grpc-server-health'

import { env } from './env'
import { BookingReserveServiceServer } from './grpcServer'
import { startKafkaConsumer } from './kafkaConsumer'

const server = createServer()

// TODO: Fix type
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
server.add(BookingReserveServiceDefinition, new BookingReserveServiceServer())
server.add(HealthDefinition, HealthServiceImpl())

await startKafkaConsumer()
const PORT = env.PORT
server.listen(`0.0.0.0:${PORT}`)
