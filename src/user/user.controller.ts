import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
//import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from 'src/typeorm/entities/user.entitie';
import { EditDetailsDto } from './dto/request';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get('findAll')
  getAll() {
    return this.userService.findAll();
  }
  @UseGuards(JwtGuard)
  @Patch('/editDetails')
  editTransactionById(
    @GetUser('id') userId: number,
    @Body() dto: EditDetailsDto,
  ) {
    return this.userService.editUserById(userId, dto);
  }
}
