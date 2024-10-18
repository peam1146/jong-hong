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
import { validateTimeFormat } from '../utils/validate.util';

@Controller()
@PlaceServiceControllerMethods()
export class PlaceController implements PlaceServiceController {
  constructor(private readonly placeService: PlaceService) {}

  async createPlace(request: CreatePlaceRequest): Promise<PlaceResponse> {
    if ((request.name = ''))
      throw new RpcException({ code: 400, message: 'Name is required' });

    if (!validateTimeFormat(request.open) || !validateTimeFormat(request.close))
      throw new RpcException({
        code: 400,
        message: 'Invalid time format (HH:MM AM/HH:MM PM)',
      });

    return await this.placeService.createPlace(request);
  }

  async getPlace(request: GetPlaceRequest): Promise<GetPlaceResponse> {
    if ((request.id = ''))
      throw new RpcException({ code: 400, message: 'Id is required' });
    return await this.placeService.getPlace(request);
  }

  async getAllPlaces(request: Empty): Promise<GetAllPlaceResponse> {
    return await this.placeService.getAllPlaces();
  }

  async updatePlace(request: UpdatePlaceRequest): Promise<PlaceResponse> {
    if ((request.id = ''))
      throw new RpcException({ code: 400, message: 'Id is required' });
    if (
      (request.open != null && !validateTimeFormat(request.open)) ||
      (request.close && !validateTimeFormat(request.close))
    )
      throw new RpcException({
        code: 400,
        message: 'Invalid time format (HH:MM AM/HH:MM PM)',
      });

    return await this.placeService.updatePlace(request);
  }

  async deletePlace(request: DeletePlaceRequest): Promise<Empty> {
    if (request.id == '')
      throw new RpcException({ code: 400, message: 'Id is required' });
    return await this.placeService.deletePlace(request);
  }
}
