import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto, EditRestaurantDto } from './dto/request';
@UseGuards(JwtGuard)
@Controller('restaurants')
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

  @Get('findAllRestaurants')
  findAll() {
    return this.restaurantService.getAllRestaurants();
  }
  @Get('filterRestaurant/:restaurantName?')
  filterRestaurants(@Param('restaurantName') restaurantName: string) {
    return this.restaurantService.filterRestaurant(restaurantName);
  }
  @Get('findRestaurantsByUserLocation')
  findRestaurantByUserLocation(@Query('userAddress') userAddress: string) {
    return this.restaurantService.findRestaurantsByUserAddress(userAddress);
  }
  @Patch(':id')
  editRestaurantById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditRestaurantDto,
  ) {
    return this.restaurantService.editRestaurantById(id, dto);
  }

  @Post('create')
  createRestaurant(@Body() dto: CreateRestaurantDto) {
    return this.restaurantService.createRestaurant(dto);
  }
}
