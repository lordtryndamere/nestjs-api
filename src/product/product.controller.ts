import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { CreateProductDto, EditProductDto } from './dto/request';
import { ProductService } from './product.service';
@UseGuards(JwtGuard)
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('findAll')
  findAll() {
    return this.productService.getAllProducts();
  }
  @Get('filterProduct/:restaurantId/:productName?')
  filterProducts(
    @Param('productName') productName: string,
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
  ) {
    return this.productService.filterProducts(productName, restaurantId);
  }
  @Delete('deleteProduct/:restaurantId/:productId')
  deleteProductById(
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.productService.deleteProductById(productId, restaurantId);
  }
  @Patch('editProduct/:restaurantId/:productId')
  editProductById(
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: EditProductDto,
  ) {
    return this.productService.editProductById(productId, restaurantId, dto);
  }
  @Post('create')
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }
}
