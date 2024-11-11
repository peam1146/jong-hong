import { Controller } from '@nestjs/common';
import { RoomService } from './room.service';
import {
  RoomServiceController,
  RoomServiceControllerMethods,
  RoomResponse,
  RoomsResponse,
  GetRoomRequest,
  GetRoomByFilterRequest,
  UpdateAvailableRequest,
} from '@jong-hong/grpc/nestjs/proto/room/room';
import { EventPattern, Payload, RpcException } from '@nestjs/microservices';
import { Empty } from '@jong-hong/grpc/nestjs/google/protobuf/empty';
import { validateDateFormat, validateTimeFormat } from '../utils/time.util';

@Controller()
@RoomServiceControllerMethods()
export class RoomController implements RoomServiceController {
  constructor(private readonly roomService: RoomService) {}

  async getRoom(request: GetRoomRequest): Promise<RoomResponse> {
    if (!request.id)
      throw new RpcException({ code: 400, message: 'Id is required.' });

    return await this.roomService.getRoom(request);
  }

  async getRoomByFilter(
    request: GetRoomByFilterRequest,
  ): Promise<RoomsResponse> {
    if (!request.date && !validateDateFormat(request.date))
      throw new RpcException({
        code: 400,
        message: 'Invalid date format (DD/MM/YY)',
      });

    if (
      (!request.availableFrom && !validateTimeFormat(request.availableFrom)) ||
      (!request.availableUntil && !validateTimeFormat(request.availableUntil))
    )
      throw new RpcException({
        code: 400,
        message: 'Invalid time format (HH:MM AM/HH:MM PM)',
      });

    if (request.peopleCount != null && request.peopleCount <= 0)
      throw new RpcException({
        code: 400,
        message: 'Number of people must be positive number',
      });

    return await this.roomService.getRoomByFilter(request);
  }

  async updateAvailableRoom(
    request: UpdateAvailableRequest,
  ): Promise<RoomResponse> {
    if (!request.id)
      throw new RpcException({ code: 400, message: 'Id is required' });

    const existingRoom = await this.getRoom({ id: request.id });

    if (!existingRoom) {
      throw new RpcException({ code: 404, message: 'Room not found' });
    }

    const updatedRoomData = {
      id: request.id,
      available: request.available,
    };
    return await this.roomService.updateAvailableRoom(updatedRoomData);
  }
}
