import { Injectable } from '@nestjs/common';
import { PrismaPromise } from '@prisma/client';
import { Types } from '@prisma/client/runtime/library';

import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaTransactionService {
  constructor(private readonly prisma: PrismaService) {}

  public async transaction<P extends PrismaPromise<any>[]>(
    actions: [...P],
  ): Promise<Types.Utils.UnwrapTuple<P>> {
    return this.prisma.$transaction(actions);
  }
}
