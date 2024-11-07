import { TransactionListGroupDto } from '$api/generated/financerApi';

export type GenericTransactionListGroupDto<T> = TransactionListGroupDto & {
  data: T[];
};
