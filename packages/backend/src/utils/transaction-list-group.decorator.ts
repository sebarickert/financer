import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { TransactionListGroupDto } from '../modules/transactions/dto/transaction-list-group.dto';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ApiTransactionListGroupDto = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(TransactionListGroupDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(TransactionListGroupDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
            required: ['data'],
          },
        ],
      },
    }),
  );
};
