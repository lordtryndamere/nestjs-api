import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto, EditCategoryDto } from './dto/request';
@UseGuards(JwtGuard)
@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('findAllCategories')
  findAllCategories() {
    return this.categoryService.getAllCategories();
  }
  @Get('filterCategory/:categoryName?')
  filterCategories(@Param('categoryName') categoryName: string) {
    return this.categoryService.filterCategory(categoryName);
  }
  @Patch(':id')
  editTransactionById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditCategoryDto,
  ) {
    return this.categoryService.editCategoryById(id, dto);
  }
  @Post('create')
  createTransaction(@Body() dto: CreateCategoryDto) {
    return this.categoryService.createCategory(dto);
  }
}
