import { Controller } from '@nestjs/common';
import { PlaceService } from './place.service';
import {
  PlaceServiceController,
  PlaceServiceControllerMethods,
  PlaceResponse,
  CreatePlaceRequest,
  GetPlaceRequest,
  DeletePlaceRequest,
  UpdatePlaceRequest,
  GetPlaceResponse,
  GetAllPlaceResponse,
} from '@jong-hong/grpc/nestjs/proto/room/place';
import { Empty } from '@jong-hong/grpc/nestjs/google/protobuf/empty';
import { RpcException } from '@nestjs/microservices';
import { convertTo24HourFormat, validateTimeFormat } from '../utils/time.util';

@Controller()
@PlaceServiceControllerMethods()
export class PlaceController implements PlaceServiceController {
  constructor(private readonly placeService: PlaceService) {}

  async createPlace(request: CreatePlaceRequest): Promise<PlaceResponse> {
    if (!request.name)
      throw new RpcException({ code: 400, message: 'Name is required' });

    if (!validateTimeFormat(request.open) || !validateTimeFormat(request.close))
      throw new RpcException({
        code: 400,
        message: 'Invalid time format (HH:MM AM/HH:MM PM)',
      });

    if (
      convertTo24HourFormat(request.open) > convertTo24HourFormat(request.close)
    )
      throw new RpcException({
        code: 400,
        message: 'Invalid time condition (open time after close time)',
      });

    return await this.placeService.createPlace(request);
  }

  async getPlace(request: GetPlaceRequest): Promise<GetPlaceResponse> {
    if (!request.id)
      throw new RpcException({ code: 400, message: 'Id is required' });
    return await this.placeService.getPlace(request);
  }

  async getAllPlaces(request: Empty): Promise<GetAllPlaceResponse> {
    return await this.placeService.getAllPlaces();
  }

  async updatePlace(request: UpdatePlaceRequest): Promise<PlaceResponse> {
    if (!request.id)
      throw new RpcException({ code: 400, message: 'Id is required' });

    const existingPlace = await this.getPlace({ id: request.id });

    const updatedPlaceData = {
      id: request.id,
      name: request.name ?? existingPlace.name,
      open: request.open ?? existingPlace.open,
      close: request.close ?? existingPlace.close,
    };

    if (
      !validateTimeFormat(updatedPlaceData.open) ||
      !validateTimeFormat(updatedPlaceData.close)
    )
      throw new RpcException({
        code: 400,
        message: 'Invalid time format (HH:MM AM/HH:MM PM)',
      });

    if (
      convertTo24HourFormat(updatedPlaceData.open) >
      convertTo24HourFormat(updatedPlaceData.close)
    )
      throw new RpcException({
        code: 400,
        message: 'Invalid time condition (open time after close time)',
      });

    return await this.placeService.updatePlace(updatedPlaceData);
  }

  async deletePlace(request: DeletePlaceRequest): Promise<Empty> {
    if (!request.id)
      throw new RpcException({ code: 400, message: 'Id is required' });
    return await this.placeService.deletePlace(request);
  }
}
