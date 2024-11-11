import {
  GetAllPlaceResponse,
  GetPlaceResponse,
} from '@jong-hong/grpc/nestjs/proto/room/place';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PlaceService {
  constructor(private prisma: DatabaseService) {}

  async getAllPlaces(): Promise<GetAllPlaceResponse> {
    try {
      const places = await this.prisma.place.findMany();

      const placesWithAvailableCounts = await Promise.all(
        places.map((place) => this.getPlaceWithAvailableCount(place.id)),
      );

      return {
        places: placesWithAvailableCounts,
      };
    } catch (error) {
      throw new RpcException({
        code: 500,
        message: `Error retrieving places: ${error.message}`,
      });
    }
  }

  private async getPlaceWithAvailableCount(
    placeId: string,
  ): Promise<GetPlaceResponse> {
    const place = await this.prisma.place.findUnique({
      where: { id: placeId },
    });

    if (!place) {
      throw new RpcException({ code: 404, message: 'Place not found' });
    }

    const availableRoomCount = await this.prisma.room.count({
      where: {
        placeId: place.id,
        available: true,
      },
    });

    return {
      id: place.id,
      name: place.name,
      open: place.open,
      close: place.close,
      availableCount: availableRoomCount,
    };
  }
}
