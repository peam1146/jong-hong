import {
  GetRoomByFilterRequest,
  GetRoomRequest,
  RoomResponse,
  RoomsResponse,
  UpdateAvailableRequest,
} from '@jong-hong/grpc/nestjs/proto/room/room';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class RoomService {
  constructor(private prisma: DatabaseService) {}

  async getRoom(request: GetRoomRequest): Promise<RoomResponse> {
    try {
      const { id } = request;
      const room = await this.prisma.room.findUnique({
        where: {
          id,
        },
      });

      if (!room) {
        throw new RpcException({ code: 400, message: 'Room not found' });
      }

      return room;
    } catch (error) {
      throw new RpcException({
        code: 500,
        message: `Failed to retrieve room: ${error.message}`,
      });
    }
  }

  async getRoomByFilter(
    request: GetRoomByFilterRequest,
  ): Promise<RoomsResponse> {
    try {
      const { placeId, peopleCount, date, availableFrom, availableUntil } =
        request;

      const rooms = await this.prisma.room.findMany({
        where: {
          placeId: placeId !== undefined ? placeId : undefined,
          AND: {
            minOccupancy: {
              lte: peopleCount !== undefined ? peopleCount : undefined,
            },
            maxOccupancy: {
              gte: peopleCount !== undefined ? peopleCount : undefined,
            },
          },
        },
      });

      return {
        rooms: rooms,
      };
    } catch (error) {
      throw new RpcException({
        code: 500,
        message: `Failed to retrieve rooms: ${error.message}`,
      });
    }
  }

  async updateAvailableRoom(
    request: UpdateAvailableRequest,
  ): Promise<RoomResponse> {
    const { id, available } = request;
    try {
      const updatedRoom = await this.prisma.room.update({
        where: { id },
        data: {
          available,
        },
      });

      return updatedRoom;
    } catch (error) {
      throw new RpcException({
        code: 500,
        message: `Failed to update room: ${error.message}`,
      });
    }
  }
}
