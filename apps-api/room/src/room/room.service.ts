import { Injectable } from '@nestjs/common';
import {
  GetRoomRequest,
  RoomResponse,
  RoomsResponse,
  UpdateAvailableRequest,
  GetRoomByFilterRequest,
} from '@jong-hong/grpc/nestjs/proto/room/room';
import { DatabaseService } from '../database/database.service';
import { RpcException } from '@nestjs/microservices';

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
          available: true,
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
