import {
  PLACE_SERVICE_NAME,
  PlaceServiceClient,
} from '@jong-hong/grpc/nestjs/proto/room/place';
import {
  ROOM_SERVICE_NAME,
  RoomServiceClient,
} from '@jong-hong/grpc/nestjs/proto/room/room';
import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('room')
export class RoomController {
  private roomServiceClient: RoomServiceClient;
  private placeServiceClient: PlaceServiceClient;
  constructor(
    @Inject(ROOM_SERVICE_NAME) private roomClient: ClientGrpc,
    @Inject(PLACE_SERVICE_NAME) private placeClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.roomServiceClient =
      this.roomClient.getService<RoomServiceClient>(ROOM_SERVICE_NAME);
    this.placeServiceClient =
      this.placeClient.getService<PlaceServiceClient>(PLACE_SERVICE_NAME);
  }

  @Get('/place')
  async getPlace() {
    return lastValueFrom(this.placeServiceClient.getAllPlaces({}));
  }

  @Get('/place/:id')
  async getPlaceById(
    @Param('id') id: string,
    @Query()
    query: {
      numberOfPeople?: number;
      date?: string;
      startTime?: string;
      endTime?: string;
    },
  ) {
    return {
      ...(await lastValueFrom(
        this.roomServiceClient.getRoomByFilter({
          placeId: id,
          peopleCount: query.numberOfPeople ?? 1,
          date: query.date ?? null,
          availableFrom: query.startTime ?? null,
          availableUntil: query.endTime ?? null,
        }),
      )),
      ...(
        await lastValueFrom(this.placeServiceClient.getAllPlaces({}))
      ).places.find((place) => place.id === id),
    };
  }

  @Get('/room/:id')
  async getRoomById(@Param('id') id: string) {
    return lastValueFrom(this.roomServiceClient.getRoom({ id }));
  }
}
