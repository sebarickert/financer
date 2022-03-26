import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateTransactionCategoryDto } from './dto/create-transaction-category.dto';
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
  ) {}

  private async isParentIdInChildHierarchy(
    id: string,
    newParentId: string,
  ): Promise<boolean> {
    const categories = await this.findAllChildrensById([id]);
    const ids = categories.map((category) => category._id + '');

    return ids.includes(newParentId);
  }

  async create(
    userId: string,
    createTransactionCategoryDto: CreateTransactionCategoryDto,
  ): Promise<TransactionCategoryDocument> {
    const newCategory = {
      ...createTransactionCategoryDto,
      owner: userId,
    };

    if (newCategory.parent_category_id) {
      await this.findOne(userId, newCategory.parent_category_id as any);
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
    userId: string,
    id: string,
  ): Promise<TransactionCategoryDocument> {
    const category = await this.transactionCategoryModel.findOne({ _id: id });

    if (!category) {
      throw new NotFoundException('Category not found.');
    } else if (category.owner + '' !== (userId as any)) {
      throw new UnauthorizedException('Unauthorized to access this categry.');
    }

    return category;
  }

  async findAllChildrensById(parentIds: string[], depth = 0) {
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

  async findAllByUser(userId: string): Promise<TransactionCategoryDocument[]> {
    // deleted is not true
    return this.transactionCategoryModel
      .find({ owner: userId, deleted: { $ne: true } })
      .exec();
  }

  async update(
    userId: string,
    id: string,
    updateTransactionCategoryDto: UpdateTransactionCategoryDto,
  ) {
    await this.findOne(userId, id);

    if (updateTransactionCategoryDto.parent_category_id) {
      const parentId = updateTransactionCategoryDto.parent_category_id;
      if (await this.isParentIdInChildHierarchy(id, parentId as any)) {
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

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.transactionCategoryModel.findByIdAndUpdate(id, {
      $set: {
        deleted: true,
      },
    });
  }

  async removeAllByUser(userId: string) {
    return this.transactionCategoryModel.deleteMany({ owner: userId }).exec();
  }

  async ensureCategoriesExist(ids: string[]) {
    const categories = await this.transactionCategoryModel.find({
      _id: { $in: ids },
    });

    if (categories.length !== ids.length) {
      throw new BadRequestException('One or more categories does not exist.');
    }
  }
}
