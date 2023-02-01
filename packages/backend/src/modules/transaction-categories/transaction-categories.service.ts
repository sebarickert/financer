import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ObjectId } from '../../types/objectId';
import { TransactionCategoryMappingsService } from '../transaction-category-mappings/transaction-category-mappings.service';

import { CreateTransactionCategoryDto } from './dto/create-transaction-category.dto';
import { CategoryMonthlySummaryDto } from './dto/transaction-month-summary.dto';
import { UpdateTransactionCategoryDto } from './dto/update-transaction-category.dto';
import {
  TransactionCategory,
  TransactionCategoryDocument,
} from './schemas/transaction-category.schema';

@Injectable()
export class TransactionCategoriesService {
  constructor(
    @InjectModel(TransactionCategory.name)
    private transactionCategoryModel: Model<TransactionCategoryDocument>,
    private readonly transactionCategoryMappingsService: TransactionCategoryMappingsService,
  ) {}

  private async isParentIdInChildHierarchy(
    id: ObjectId,
    newParentId: ObjectId,
  ): Promise<boolean> {
    const categories = await this.findAllChildrensById([id]);
    const ids = categories.map((category) => category._id.toString());

    return ids.includes(newParentId.toString());
  }

  async create(
    userId: ObjectId,
    createTransactionCategoryDto: CreateTransactionCategoryDto,
  ): Promise<TransactionCategoryDocument> {
    const newCategory = {
      ...createTransactionCategoryDto,
      owner: userId,
    };

    if (newCategory.parent_category_id) {
      await this.findOne(userId, newCategory.parent_category_id);
    }

    return this.transactionCategoryModel.create(newCategory);
  }

  async createMany(
    createTransactionCategoryDto: CreateTransactionCategoryDto[],
  ) {
    return this.transactionCategoryModel.insertMany(
      createTransactionCategoryDto,
    );
  }

  findAll() {
    return `This action returns all transactionCategories`;
  }

  async findOne(
    userId: ObjectId,
    id: ObjectId,
  ): Promise<TransactionCategoryDocument> {
    const category = await this.transactionCategoryModel.findOne({ _id: id });

    if (!category) {
      throw new NotFoundException('Category not found.');
    } else if (!category.owner.equals(userId)) {
      throw new UnauthorizedException('Unauthorized to access this categry.');
    }

    return category;
  }

  async findAllChildrensById(parentIds: ObjectId[], depth = 0) {
    if (depth > 10) {
      throw new InternalServerErrorException(
        'Too many levels of nesting, probably infite loop on hierarchy?',
      );
    }
    const categories = await this.transactionCategoryModel.find({
      parent_category_id: { $in: parentIds },
    });

    const ids = categories.map((category) => category._id);
    if (ids.length === 0) {
      return categories;
    }
    const childCategories = await this.findAllChildrensById(ids, depth + 1);

    return [...categories, ...childCategories];
  }

  async findAllByUser(
    userId: ObjectId,
  ): Promise<TransactionCategoryDocument[]> {
    return this.transactionCategoryModel
      .find({ owner: userId, deleted: { $ne: true } })
      .exec();
  }

  async findMonthlySummariesByUserAndId(
    userId: ObjectId,
    parentCategoryId: ObjectId,
    limit?: number,
    year?: number,
    month?: number,
  ): Promise<CategoryMonthlySummaryDto[]> {
    const childrenIds = await this.findAllChildrensById([parentCategoryId]);
    const targetIds = [parentCategoryId, ...childrenIds];

    return this.transactionCategoryMappingsService.findMonthlySummariesByUserAndId(
      userId,
      targetIds,
      limit,
      year,
      month,
    );
  }

  async update(
    userId: ObjectId,
    id: ObjectId,
    updateTransactionCategoryDto: UpdateTransactionCategoryDto,
  ) {
    await this.findOne(userId, id);

    if (updateTransactionCategoryDto.parent_category_id) {
      const parentId = updateTransactionCategoryDto.parent_category_id;
      if (await this.isParentIdInChildHierarchy(id, parentId)) {
        throw new BadRequestException(
          'Parent category cannot be child category of current item.',
        );
      }
    }

    return this.transactionCategoryModel.findByIdAndUpdate(
      id,
      updateTransactionCategoryDto,
      { new: true },
    );
  }

  async remove(userId: ObjectId, id: ObjectId) {
    await this.findOne(userId, id);
    await this.transactionCategoryModel.findByIdAndUpdate(id, {
      $set: {
        deleted: true,
      },
    });
  }

  async removeAllByUser(userId: ObjectId) {
    await this.transactionCategoryModel.deleteMany({ owner: userId }).exec();
  }

  async ensureCategoriesExist(ids: ObjectId[]) {
    const categories = await this.transactionCategoryModel.find({
      _id: { $in: ids },
    });

    if (categories.length !== ids.length) {
      throw new BadRequestException('One or more categories does not exist.');
    }
  }
}
