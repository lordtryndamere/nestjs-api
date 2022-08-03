import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Category } from 'src/typeorm/entities/category.entitie';
import { Like, Repository } from 'typeorm';
import { CreateCategoryDto, EditCategoryDto } from './dto/request';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private categoryRepository: Repository<Category>,
  ) {}
  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      order: {
        createdAt: 'asc',
      },
      cache: true,
    });
  }
  async filterCategory(categoryName = ''): Promise<Category[]> {
    return this.categoryRepository.find({
      where: {
        name: Like(`%${categoryName}%`),
      },

      order: {
        createdAt: 'asc',
      },
      cache: true,
    });
  }

  async createCategory(category: CreateCategoryDto): Promise<Category> {
    try {
      const categoryRecord = await this.categoryRepository.save({
        ...category,
        createdAt: new Date(),
      });
      return categoryRecord;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  async editCategoryById(categoryId: number, dto: EditCategoryDto) {
    try {
      let findCategory = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      if (!findCategory)
        throw new ForbiddenException('Access to resources denied');

      await this.categoryRepository.update(
        {
          id: findCategory.id,
        },
        { ...dto, updatedAt: new Date() },
      );
      findCategory = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      return findCategory;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
