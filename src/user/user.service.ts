import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../typeorm/entities/user.entitie';
import { EditDetailsDto } from './dto/request';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  async editUserById(userId: number, dto: EditDetailsDto) {
    try {
      const findUser = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!findUser) throw new ForbiddenException('Access to resources denied');
      return this.userRepository.update(
        {
          id: findUser.id,
        },
        { ...dto, updatedAt: new Date() },
      );
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
