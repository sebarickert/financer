import { Injectable } from '@nestjs/common';
import { Prisma, PrismaPromise, UserPreferences } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class UserPreferencesRepo {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    userPreferencesWhereUniqueInput: Prisma.UserPreferencesWhereUniqueInput,
  ): Promise<UserPreferences | null> {
    return this.prisma.userPreferences.findUnique({
      where: userPreferencesWhereUniqueInput,
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserPreferencesWhereUniqueInput;
    where?: Prisma.UserPreferencesWhereInput;
    orderBy?: Prisma.UserPreferencesOrderByWithRelationInput;
  }): Promise<UserPreferences[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.userPreferences.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(
    data: Prisma.UserPreferencesUncheckedCreateInput,
  ): Promise<UserPreferences> {
    return this.prisma.userPreferences.create({
      data,
    });
  }

  createMany(
    data: Prisma.UserPreferencesUncheckedCreateInput[],
  ): PrismaPromise<Prisma.BatchPayload> {
    return this.prisma.userPreferences.createMany({
      data,
    });
  }

  async update(params: {
    where: Prisma.UserPreferencesWhereUniqueInput;
    data: Prisma.UserPreferencesUpdateInput;
  }): Promise<UserPreferences> {
    const { where, data } = params;
    return this.prisma.userPreferences.update({
      data,
      where,
    });
  }

  async delete(
    where: Prisma.UserPreferencesWhereUniqueInput,
  ): Promise<UserPreferences> {
    return this.prisma.userPreferences.delete({
      where,
    });
  }

  deleteMany(where: Prisma.UserPreferencesWhereInput) {
    return this.prisma.userPreferences.deleteMany({
      where,
    });
  }
}
