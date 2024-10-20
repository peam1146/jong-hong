import { Controller } from '@nestjs/common';
import { RoomService } from './room.service';
import {
  RoomServiceController,
  RoomServiceControllerMethods,
  RoomResponse,
  CreateRoomRequest,
  RoomsResponse,
  GetRoomRequest,
  DeleteRoomRequest,
  UpdateRoomRequest,
  GetAllRoomsRequest,
} from '@jong-hong/grpc/nestjs/proto/room/room';
import { EventPattern, Payload, RpcException } from '@nestjs/microservices';
import { Empty } from '@jong-hong/grpc/nestjs/google/protobuf/empty';
import { validateDateFormat, validateTimeFormat } from '../utils/validate.util';

@Controller()
@RoomServiceControllerMethods()
export class RoomController implements RoomServiceController {
  constructor(private readonly roomService: RoomService) {}

  async createRoom(request: CreateRoomRequest): Promise<RoomResponse> {
    if (!request.name)
      throw new RpcException({ code: 400, message: 'Name is required.' });

    if (!request.placeId)
      throw new RpcException({ code: 400, message: 'PlaceId is required.' });

    if (
      request.maxCapacity < request.minCapacity ||
      request.maxCapacity <= 0 ||
      request.minCapacity <= 0
    )
      throw new RpcException({
        code: 400,
        message:
          'Invalid capacity condition (capacity must be positive and max max should be greater than min min)',
      });

    return await this.roomService.createRoom(request);
  }

  async getRoom(request: GetRoomRequest): Promise<RoomResponse> {
    if (!request.id)
      throw new RpcException({ code: 400, message: 'Id is required.' });

    return await this.roomService.getRoom(request);
  }

  async getAllRooms(request: GetAllRoomsRequest): Promise<RoomsResponse> {
    if (!request.date && !validateDateFormat(request.date))
      throw new RpcException({
        code: 400,
        message: 'Invalid date format (DD/MM/YY)',
      });

    if (
      (!request.startTime && !validateTimeFormat(request.startTime)) ||
      (!request.endTime && !validateTimeFormat(request.endTime))
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

    return await this.roomService.getAllRooms(request);
  }

  async updateRoom(request: UpdateRoomRequest): Promise<RoomResponse> {
    if (!request.id)
      throw new RpcException({ code: 400, message: 'Id is required' });

    const existingRoom = await this.getRoom({ id: request.id });

    if (!existingRoom) {
      throw new RpcException({ code: 404, message: 'Room not found' });
    }

    const updatedRoomData = {
      id: request.id,
      name: request.name ?? existingRoom.name,
      minCapacity: request.minCapacity ?? existingRoom.minCapacity,
      maxCapacity: request.maxCapacity ?? existingRoom.maxCapacity,
      placeId: request.placeId ?? existingRoom.placeId,
      available:
        request.available !== undefined
          ? request.available
          : existingRoom.available,
    };

    if (
      updatedRoomData.maxCapacity < updatedRoomData.minCapacity ||
      updatedRoomData.maxCapacity <= 0 ||
      updatedRoomData.minCapacity <= 0
    ) {
      throw new RpcException({
        code: 400,
        message:
          'Invalid capacity condition (capacity must be positive and max should be greater than min when both are provided)',
      });
    }
    return await this.roomService.updateRoom(updatedRoomData);
  }

  async deleteRoom(request: DeleteRoomRequest): Promise<Empty> {
    if (!request.id)
      throw new RpcException({ code: 400, message: 'Id is required.' });
    return await this.roomService.deleteRoom(request);
  }

  @EventPattern('check-in')
  async handleCheckIn(@Payload() message: { roomId: string }) {
    try {
      const roomId = message.roomId;

      // Call the service to update the room's availability
      await this.roomService.updateRoom({
        id: roomId,
        available: false, // Set room to unavailable
      });

      console.log(
        `Room ${roomId} has been checked in and marked as unavailable.`,
      );
    } catch (error) {
      console.error(`Failed to check in room: ${error.message}`);
      throw new Error('Room check-in failed');
    }
  }

  @EventPattern('check-out')
  async handleCheckOut(@Payload() message: { roomId: string }) {
    try {
      const roomId = message.roomId;

      // Call the service to update the room's availability
      await this.roomService.updateRoom({
        id: roomId,
        available: true, // Set room to unavailable
      });

      console.log(
        `Room ${roomId} has been checked out and marked as available.`,
      );
    } catch (error) {
      console.error(`Failed to check in room: ${error.message}`);
      throw new Error('Room check-out failed');
    }
  }
}
