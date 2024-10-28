import clsx from 'clsx';
import { FC } from 'react';

import {
  ExpenseDetailsDto,
  IncomeDetailsDto,
  TransferDetailsDto,
} from '$api/generated/financerApi';
import { BalanceDisplay } from '$blocks/BalanceDisplay';
import { DetailsList } from '$blocks/details-list/details-list';
import { DetailsItem } from '$blocks/details-list/details-list.item';
import { Heading } from '$elements/Heading';
import { Icon, IconName } from '$elements/Icon';
import { Link } from '$elements/Link';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { CategoryService } from '$ssr/api/category.service';
import { capitalize } from '$utils/capitalize';
import { formatCurrency } from '$utils/formatCurrency';
import { DateFormat, formatDate } from '$utils/formatDate';

type TransactionProps =
  | IncomeDetailsDto
  | ExpenseDetailsDto
  | TransferDetailsDto;

export const Transaction: FC<TransactionProps> = async ({
  type,
  date,
  categories,
  id,
  amount,
  description,
  ...props
}) => {
  const fromAccountName =
    'fromAccountName' in props ? props.fromAccountName : null;
  const toAccountName = 'toAccountName' in props ? props.toAccountName : null;

  const transactionCategories = await CategoryService.getAllWithTree();

  const getCategoryNameById = (categoryId: string) =>
    transactionCategories?.find((category) => category.id === categoryId)
      ?.categoryTree || categoryId;

  const transactionDetails: DetailsItem[] = [
    ...(fromAccountName
      ? [
          {
            icon: 'Squares2X2Icon' as IconName,
            label: 'From Account',
            description: fromAccountName,
          },
        ]
      : []),
    ...(toAccountName
      ? [
          {
            icon: 'Squares2X2Icon' as IconName,
            label: 'To Account',
            description: toAccountName,
          },
        ]
      : []),
    {
      icon: 'CalendarIcon',
      label: 'Date',
      description: formatDate(new Date(date), DateFormat.long),
    },
    {
      icon: 'InformationCircleIcon',
      label: 'Type',
      description: capitalize(type.toLowerCase()),
    },
  ];

  const categoryDetails: DetailsItem[][] = categories.map(
    ({
      amount: categoryAmount,
      description: categoryDescription,
      id: categoryId,
    }) => {
      return [
        {
          icon: 'TagIcon',
          label: 'Category',
          description: getCategoryNameById(categoryId as unknown as string),
        },
        {
          icon: 'InformationCircleIcon',
          label: 'Amount',
          description: formatCurrency(categoryAmount),
        },
        ...(categoryDescription
          ? [
              {
                icon: 'ChatBubbleBottomCenterTextIcon' as IconName,
                label: 'Description',
                description: categoryDescription,
              },
            ]
          : []),
      ];
    },
  );

  return (
    <>
      <UpdatePageInfo
        backLink="/statistics"
        headerAction={
          <Link
            haptic="medium"
            href={`/statistics/${type.toLowerCase()}s/${id}/edit`}
            testId={`edit-${type.toLowerCase()}-button`}
            transition="slideInFromRight"
          >
            <span className="sr-only">Edit</span>
            <Icon name="PencilIcon" />
          </Link>
        }
      />
      <section className={clsx('@container')}>
        <div
          className={clsx(
            'theme-layer-color rounded-md',
            'pt-8 pb-4 px-4',
            'grid gap-y-8 gap-x-4',
            '@3xl:pt-4 @3xl:grid-cols-[1fr,1.5fr]',
          )}
        >
          <BalanceDisplay type={type} amount={amount}>
            {`${description}`}
          </BalanceDisplay>
          <div className="grid gap-8 p-6 border rounded-md theme-layer-secondary-color theme-border-primary">
            <DetailsList items={transactionDetails} />
            {categoryDetails.length > 0 && (
              <div>
                <Heading disableResponsiveSizing noMargin className="mb-4">
                  Categories
                </Heading>
                {categoryDetails.map((category) => (
                  <DetailsList
                    testId="category-details"
                    key={category[0].label}
                    items={category}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
