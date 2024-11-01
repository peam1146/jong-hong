import { Controller } from '@nestjs/common';
import { PlaceService } from './place.service';
import {
  PlaceServiceController,
  PlaceServiceControllerMethods,
  GetAllPlaceResponse,
} from '@jong-hong/grpc/nestjs/proto/room/place';
import { Empty } from '@jong-hong/grpc/nestjs/google/protobuf/empty';

@Controller()
@PlaceServiceControllerMethods()
export class PlaceController implements PlaceServiceController {
  constructor(private readonly placeService: PlaceService) {}

  async getAllPlaces(request: Empty): Promise<GetAllPlaceResponse> {
    return await this.placeService.getAllPlaces();
  }
}
