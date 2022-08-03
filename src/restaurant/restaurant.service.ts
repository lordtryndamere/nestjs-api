import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { CreateRestaurantDto, EditRestaurantDto } from './dto/request';
import { Restaurant } from 'src/typeorm/entities/restaurant.entitie';
import {
  findUserLocationByAddress,
  getDistanceBetweenTwoPoints,
} from './helper';
@Injectable()
export class RestaurantService {
  constructor(
    @Inject('RESTAURANT_REPOSITORY')
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async getAllRestaurants(): Promise<Restaurant[]> {
    return this.restaurantRepository.find({
      order: {
        createdAt: 'asc',
      },
      cache: true,
    });
  }
  async filterRestaurant(restaurantName = ''): Promise<Restaurant[]> {
    return this.restaurantRepository.find({
      where: {
        name: Like(`%${restaurantName}%`),
      },
      order: {
        createdAt: 'asc',
      },
      cache: true,
    });
  }
  async findRestaurantsByUserAddress(
    userAddress: string,
  ): Promise<Restaurant[]> {
    try {
      const { lat: latitudeUserAddress, lng: longitudeUserAddress } =
        await findUserLocationByAddress(userAddress);
      console.log(latitudeUserAddress, longitudeUserAddress);
      let restaurants: Restaurant[] = await this.restaurantRepository.find({
        cache: true,
      });
      restaurants = restaurants.map((restaurant) => ({
        ...restaurant,
        distance: getDistanceBetweenTwoPoints(
          latitudeUserAddress,
          longitudeUserAddress,
          parseFloat(restaurant.latitude),
          parseFloat(restaurant.longitude),
        ),
      }));
      return restaurants.sort((a: any, b: any) => a.distance - b.distance);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async createRestaurant(restaurant: CreateRestaurantDto): Promise<Restaurant> {
    try {
      const restaurantRecord = await this.restaurantRepository.save({
        ...restaurant,
        createdAt: new Date(),
      });
      return restaurantRecord;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async editRestaurantById(restaurantId: number, dto: EditRestaurantDto) {
    try {
      let findRestaurant = await this.restaurantRepository.findOne({
        where: { id: restaurantId },
      });
      if (!findRestaurant)
        throw new ForbiddenException('Access to resources denied');

      await this.restaurantRepository.update(
        {
          id: findRestaurant.id,
        },
        { ...dto, updatedAt: new Date() },
      );
      findRestaurant = await this.restaurantRepository.findOne({
        where: { id: restaurantId },
      });
      return findRestaurant;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
