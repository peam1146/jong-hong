import { Empty } from '@jong-hong/grpc/nestjs/google/protobuf/empty';
import {
  CreatePlaceRequest,
  DeletePlaceRequest,
  GetAllPlaceResponse,
  GetPlaceRequest,
  PlaceResponse,
  UpdatePlaceRequest,
} from '@jong-hong/grpc/nestjs/proto/room/place';
import { GetPlaceResponse } from '@jong-hong/grpc/ts/proto/room/place';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PlaceService {
  constructor(private prisma: DatabaseService) {}

  async createPlace(request: CreatePlaceRequest): Promise<PlaceResponse> {
    try {
      const { name, open, close } = request;

      const place = await this.prisma.place.create({
        data: {
          name,
          open,
          close,
        },
      });

      return place;
    } catch (error) {
      throw new RpcException({
        code: 500,
        message: `Error creating place: ${error.message}`,
      });
    }
  }

  async getPlace(request: GetPlaceRequest): Promise<GetPlaceResponse> {
    try {
      const place = await this.getPlaceWithAvailableCount(request.id);

      if (!place) {
        throw new RpcException({ code: 404, message: 'Place not found' });
      }

      return place;
    } catch (error) {
      throw new RpcException({
        code: 500,
        message: `Error retrieving place: ${error.message}`,
      });
    }
  }

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

  async updatePlace(request: UpdatePlaceRequest): Promise<PlaceResponse> {
    try {
      const { id, name, open, close } = request;

      const place = await this.prisma.place.update({
        where: { id },
        data: {
          name: name || undefined,
          open: open || undefined,
          close: close || undefined,
        },
      });

      return place;
    } catch (error) {
      throw new RpcException({
        code: 500,
        message: `Error updating place: ${error.message}`,
      });
    }
  }

  async deletePlace(request: DeletePlaceRequest): Promise<Empty> {
    try {
      const { id } = request;

      await this.prisma.place.delete({
        where: { id },
      });

      return {};
    } catch (error) {
      throw new RpcException({
        code: 500,
        message: `Error deleting place: ${error.message}`,
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
