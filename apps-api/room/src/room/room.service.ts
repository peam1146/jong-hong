import { Injectable } from '@nestjs/common';
import {
  CreateRoomRequest,
  UpdateRoomRequest,
  GetRoomRequest,
  DeleteRoomRequest,
  RoomResponse,
  RoomsResponse,
} from '@jong-hong/grpc/nestjs/proto/room/room';
import { DatabaseService } from '../database/database.service';
import { RpcException } from '@nestjs/microservices';
import { Empty } from '@jong-hong/grpc/nestjs/google/protobuf/empty';

@Injectable()
export class RoomService {
  constructor(private prisma: DatabaseService) {}

  // Create a new room
  async createRoom(request: CreateRoomRequest): Promise<RoomResponse> {
    try {
      const { name, minCapacity, maxCapacity, placeId } = request;
      // Creating a new room in the database
      const room = await this.prisma.room.create({
        data: {
          name,
          minCapacity,
          maxCapacity,
          placeId,
        },
      });

      return room;
    } catch (error) {
      throw new RpcException({
        code: 500,
        message: `Failed to create room: ${error.message}`,
      });
    }
  }

  // Fetch a single room by ID
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

  // Fetch all rooms (filtered by optional parameters)
  async getAllRooms(request: any): Promise<RoomsResponse> {
    try {
      const { placeId, peopleCount, date, startTime, endTime } = request;

      const rooms = await this.prisma.room.findMany({
        where: {
          placeId: placeId || undefined,
          available: true,
          AND: {
            minCapacity: {
              lte: peopleCount || undefined,
            },
            maxCapacity: {
              gte: peopleCount || undefined,
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

  // Update an existing room
  async updateRoom(request: UpdateRoomRequest): Promise<RoomResponse> {
    const { id, name, minCapacity, maxCapacity, placeId, available } = request;
    try {
      const updatedRoom = await this.prisma.room.update({
        where: { id },
        data: {
          name,
          minCapacity,
          maxCapacity,
          placeId,
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

  // Delete a room by ID
  async deleteRoom(request: DeleteRoomRequest): Promise<Empty> {
    try {
      await this.prisma.room.delete({
        where: {
          id: request.id,
        },
      });
      return {};
    } catch (error) {
      throw new RpcException({
        code: 500,
        message: `Failed to delete room: ${error.message}`,
      });
    }
  }
}
