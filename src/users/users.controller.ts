import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { responseData } from '../utils/util';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('createUserDto', createUserDto);
    const { account } = createUserDto;
    const res = await this.usersService.findOne(account);
    console.log('res', res);
    if (res) {
      return responseData(false, '用户已存在');
    } else {
      await this.usersService.create(createUserDto);
      return responseData(true, '用户创建成功');
    }
  }

  @Post('/login')
  async login(@Body() createUserDto: CreateUserDto) {
    console.log('登录', createUserDto);
    const { account, password } = createUserDto;
    const res = await this.usersService.findOne(account);
    if (res) {
      console.log('res', res);
      if (password === res.password) {
        return responseData(true, '验证成功');
      } else {
        return responseData(false, '密码错误');
      }
    } else {
      return responseData(false, '用户不存在');
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
