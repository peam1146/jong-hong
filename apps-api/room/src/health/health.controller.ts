import {
  BookingHealthServiceController,
  BookingHealthServiceControllerMethods,
  PingRequest,
  PingResponse,
} from '@jong-hong/grpc/nestjs/proto/booking/health';
import { Controller } from '@nestjs/common';

@Controller()
@BookingHealthServiceControllerMethods()
export class HealthController implements BookingHealthServiceController {
  ping(request: PingRequest): PingResponse {
    return {
      message: request.message,
    };
  }
}
