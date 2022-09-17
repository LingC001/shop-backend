import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Request } from 'express';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { replaceFileName, responseData } from '../utils/util';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('pic'))
  async create(
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() createFoodDto: CreateFoodDto,
  ) {
    const { NODE_ENV } = process.env;
    const hostName =
      NODE_ENV === 'development' ? 'localhost:3000' : 'fanhualianhua.top';
    const resName = replaceFileName(file.originalname);
    createFoodDto.image = `http://${hostName}/images/${resName}`;
    const writeImage = createWriteStream(
      join(__dirname, '..', '../public/upload', `${resName}`),
    );
    writeImage.write(file.buffer);
    await this.foodsService.create(createFoodDto);
    return responseData(true, '文件上传成功');
  }

  @Get()
  findAll() {
    return this.foodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
    return this.foodsService.update(+id, updateFoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodsService.remove(+id);
  }
}
