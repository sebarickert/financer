import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TransactionCategory, TransactionType } from '@prisma/client';

import { CreateTransactionCategoryDto } from './dto/create-transaction-category.dto';
import { TransactionCategoryDetailsDto } from './dto/transaction-category-details.dto';
import { TransactionCategoryDto } from './dto/transaction-category.dto';
import { CategoryMonthlySummaryDto } from './dto/category-month-summary.dto';
import { UpdateTransactionCategoryDto } from './dto/update-transaction-category.dto';

import { TransactionCategoryRepo } from '@/database/repos/transaction-category.repo';
import { TransactionCategoryMappingsService } from '@/transaction-category-mappings/transaction-category-mappings.service';
import { UserId } from '@/types/user-id';

@Injectable()
export class TransactionCategoriesService {
  constructor(
    private readonly transactionCategoryRepo: TransactionCategoryRepo,
    private readonly transactionCategoryMappingsService: TransactionCategoryMappingsService,
  ) {}

  private async isParentIdInChildHierarchy(
    categoryId: string,
    newParentId: string,
  ): Promise<boolean> {
    const categories = await this.findAllChildrenById([categoryId]);
    const ids = categories.map(({ id }) => id);

    return ids.includes(newParentId);
  }

  async create(
    userId: UserId,
    createTransactionCategoryDto: CreateTransactionCategoryDto,
  ): Promise<TransactionCategory> {
    const newCategory = {
      ...createTransactionCategoryDto,
      userId,
    };

    if (newCategory.parentCategoryId) {
      await this.findOne(userId, newCategory.parentCategoryId);
    }

    return this.transactionCategoryRepo.create(newCategory);
  }

  createMany(
    userId: UserId,
    createTransactionCategoryDto: CreateTransactionCategoryDto[],
  ) {
    return this.transactionCategoryRepo.createMany(
      createTransactionCategoryDto.map((category) => ({
        ...category,
        userId,
      })),
    );
  }

  findAll() {
    return `This action returns all transactionCategories`;
  }

  async findOne(
    userId: UserId,
    id: string,
  ): Promise<TransactionCategoryDetailsDto> {
    const category = await this.transactionCategoryRepo.findOne({ id, userId });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    const allCategories = await this.findAllByUser(userId);

    return TransactionCategoryDetailsDto.createFromPlain({
      ...category,
      path: TransactionCategoriesService.buildParentCategoryPath(
        allCategories,
        category.id,
      ),
    });
  }

  async findAllChildrenById(
    parentIds: string[],
    depth = 0,
  ): Promise<TransactionCategory[]> {
    if (depth > 10) {
      throw new InternalServerErrorException(
        'Too many levels of nesting, probably infinite loop on hierarchy?',
      );
    }

    const categories = await this.transactionCategoryRepo.findMany({
      where: {
        parentCategoryId: { in: parentIds },
      },
    });

    const categoryIds = categories.map((category) => category.id);

    if (categoryIds.length === 0) {
      return categories;
    }

    const childCategories = await this.findAllChildrenById(
      categoryIds,
      depth + 1,
    );

    return [...categories, ...childCategories];
  }

  async findAllDetailsByUser(
    userId: UserId,
    visibilityType: TransactionType | null = null,
  ): Promise<TransactionCategoryDetailsDto[]> {
    const categories = await this.findAllByUser(userId, visibilityType);

    const allCategories = await this.findAllByUser(userId);

    return TransactionCategoryDetailsDto.createFromPlain(
      categories.map((category) => ({
        ...category,
        path: TransactionCategoriesService.buildParentCategoryPath(
          allCategories,
          category.id,
        ),
      })),
    );
  }

  async findAllByUser(
    userId: UserId,
    visibilityType: TransactionType | null = null,
  ): Promise<TransactionCategoryDto[]> {
    const categories = await this.transactionCategoryRepo.findMany({
      where: {
        userId,
        deleted: { not: true },
        visibility: visibilityType
          ? {
              has: visibilityType,
            }
          : undefined,
      },
    });

    return TransactionCategoryDto.createFromPlain(
      categories.map((category) => ({
        ...category,
      })),
    );
  }

  async findAllByUserForExport(userId: UserId) {
    const categories = await this.transactionCategoryRepo.findMany({
      where: { userId },
    });
    return TransactionCategoryDto.createFromPlain(categories);
  }

  // eslint-disable-next-line max-params
  async findMonthlySummariesByUserAndId(
    userId: UserId,
    parentCategoryId: string,
    year?: number,
    month?: number,
  ): Promise<CategoryMonthlySummaryDto[]> {
    const childrenCategories = await this.findAllChildrenById([
      parentCategoryId,
    ]);
    const childrenIds = childrenCategories.map(({ id }) => id);
    const targetIds = [parentCategoryId, ...childrenIds];

    return this.transactionCategoryMappingsService.findMonthlySummariesByUserAndId(
      userId,
      targetIds,
      year,
      month,
    );
  }

  async update(
    userId: UserId,
    id: string,
    updateTransactionCategoryDto: UpdateTransactionCategoryDto,
  ) {
    await this.findOne(userId, id);

    if (updateTransactionCategoryDto.parentCategoryId) {
      const parentId = updateTransactionCategoryDto.parentCategoryId;

      if (await this.isParentIdInChildHierarchy(id, parentId)) {
        throw new BadRequestException(
          'Parent category cannot be child category of current item.',
        );
      }
    }

    return this.transactionCategoryRepo.update({
      where: { id, userId },
      data: updateTransactionCategoryDto,
    });
  }

  async remove(userId: UserId, id: string) {
    await this.findOne(userId, id);

    await this.transactionCategoryRepo.update({
      where: { id, userId },
      data: { deleted: true },
    });
  }

  removeAllByUser(userId: UserId) {
    return this.transactionCategoryRepo.deleteMany({ userId });
  }

  async ensureCategoriesExist(ids: string[]) {
    const categories = await this.transactionCategoryRepo.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    const hasMatchingCategoryIds = ids.every((id) =>
      categories.some((category) => category.id === id),
    );

    if (!hasMatchingCategoryIds) {
      throw new BadRequestException('One or more categories does not exist.');
    }
  }

  public static buildParentCategoryPath(
    allCategories: Pick<
      TransactionCategoryDto,
      'name' | 'id' | 'parentCategoryId'
    >[],
    categoryId: string,
  ): string {
    const targetCategory = allCategories.find(({ id }) => id === categoryId);

    if (!targetCategory) {
      return '';
    }

    if (!targetCategory.parentCategoryId) {
      return targetCategory.name;
    }

    const parentPath = TransactionCategoriesService.buildParentCategoryPath(
      allCategories,
      targetCategory.parentCategoryId,
    );
    return `${parentPath} > ${targetCategory.name}`;
  }
}
