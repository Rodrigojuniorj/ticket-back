import { UserDTO } from './user.dto';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: UserDTO) {
    return await this.userService.create(data);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: UserDTO) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}
