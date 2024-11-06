import Decimal from 'decimal.js';

import {
  TransactionTemplateType,
  TransactionType,
} from '$types/generated/financer';
import { applyFixture } from '$utils/applyFixture';
import { test, expect, Page } from '$utils/financer-page';
import { fillTemplateForm } from '$utils/template/fillTemplateForm';
import { getTemplateDataFromTemplateList } from '$utils/template/getTemplateDataFromTemplateList';
import { getTemplateFormValues } from '$utils/template/getTemplateFormValues';
import { fillAndSubmitTransactionCategoryForm } from '$utils/transaction/fillAndSubmitTransactionCategoryForm';

const transactionTypes = [
  TransactionType.Income,
  TransactionType.Expense,
  TransactionType.Transfer,
];

const templateData = ({
  templateType,
  transactionType,
  amount,
  dayOfMonth,
  dayOfMonthToCreate,
}: {
  templateType: TransactionTemplateType;
  transactionType: TransactionType;
  amount?: Decimal;
  dayOfMonth?: Decimal;
  dayOfMonthToCreate?: Decimal;
}) => ({
  templateType,
  transactionType,
  name: `New ${transactionType} Template`,
  description: `New ${transactionType} Template Description`,
  amount,
  toAccount:
    transactionType === TransactionType.Income ||
    transactionType === TransactionType.Transfer
      ? 'Saving account 1'
      : undefined,
  fromAccount:
    transactionType === TransactionType.Expense ||
    transactionType === TransactionType.Transfer
      ? 'Investment account'
      : undefined,
  dayOfMonth:
    templateType === TransactionTemplateType.Auto ? dayOfMonth : undefined,
  dayOfMonthToCreate:
    templateType === TransactionTemplateType.Auto
      ? dayOfMonthToCreate
      : undefined,
});

test.describe('Add Template', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture();
    await page.goto('/settings/templates');
  });

  test.describe(`Manual Template`, () => {
    const templateType = TransactionTemplateType.Manual;

    transactionTypes.forEach((transactionType) => {
      test.describe(`Template of type ${transactionType}`, () => {
        const createAndSubmitTemplate = async (
          page: Page,
          amount?: Decimal,
          category?: string,
        ) => {
          const initialTemplates = await getTemplateDataFromTemplateList(page);
          await page.getByTestId('add-template').click();
          await fillTemplateForm(
            page,
            templateData({ templateType, transactionType, amount }),
          );

          if (category) {
            await page
              .getByTestId('template-form')
              .getByTestId('add-category')
              .click();
            await fillAndSubmitTransactionCategoryForm(
              page,
              { category },
              true,
            );
          }

          await page.getByTestId('template-form').getByTestId('submit').click();

          const updatedTemplates = await getTemplateDataFromTemplateList(page);
          expect(updatedTemplates).toHaveLength(initialTemplates.length + 1);
          expect(initialTemplates).not.toContain(
            `New ${transactionType} Template`,
          );
          expect(updatedTemplates).toContain(`New ${transactionType} Template`);
        };

        const expectedTemplateValues = {
          templateType: TransactionTemplateType.Manual,
          transactionType,
          name: `New ${transactionType} Template`,
          description: `New ${transactionType} Template Description`,
          toAccount: templateData({ templateType, transactionType }).toAccount,
          fromAccount: templateData({ templateType, transactionType })
            .fromAccount,
        };

        test('should add and verify a manual template without amount', async ({
          page,
        }) => {
          await createAndSubmitTemplate(page, undefined);
          await page
            .getByTestId('template-list')
            .getByText(`New ${transactionType} Template`)
            .click();
          const templateValues = await getTemplateFormValues(page);

          expect(templateValues).toEqual(
            expect.objectContaining(expectedTemplateValues),
          );
        });

        test('should add and verify a manual template with amount', async ({
          page,
        }) => {
          await createAndSubmitTemplate(page, new Decimal(1000));
          await page
            .getByTestId('template-list')
            .getByText(`New ${transactionType} Template`)
            .click();
          const templateValues = await getTemplateFormValues(page);

          expect(templateValues).toEqual(
            expect.objectContaining({
              ...expectedTemplateValues,
              amount: new Decimal(1000),
            }),
          );
        });

        test('should add and verify a manual template with category', async ({
          page,
        }) => {
          await createAndSubmitTemplate(
            page,
            new Decimal(1000),
            'Category for all types',
          );
          await page
            .getByTestId('template-list')
            .getByText(`New ${transactionType} Template`)
            .click();
          const templateValues = await getTemplateFormValues(page);

          expect(templateValues).toEqual(
            expect.objectContaining({
              ...expectedTemplateValues,
              amount: new Decimal(1000),
              categoriesCount: 1,
            }),
          );
        });
      });
    });
  });

  test.describe(`Auto Template`, () => {
    const templateType = TransactionTemplateType.Auto;

    transactionTypes.forEach((transactionType) => {
      test.describe(`Template of type ${transactionType}`, () => {
        const createAndSubmitTemplate = async (
          page: Page,
          {
            amount,
            category,
            dayOfMonth,
            dayOfMonthToCreate,
          }: {
            amount?: Decimal;
            category?: string;
            dayOfMonth?: Decimal;
            dayOfMonthToCreate?: Decimal;
          },
        ) => {
          const initialTemplates = await getTemplateDataFromTemplateList(page);
          await page.getByTestId('add-template').click();
          await fillTemplateForm(
            page,
            templateData({
              templateType,
              transactionType,
              amount,
              dayOfMonth,
              dayOfMonthToCreate,
            }),
          );

          if (category) {
            await page
              .getByTestId('template-form')
              .getByTestId('add-category')
              .click();
            await fillAndSubmitTransactionCategoryForm(
              page,
              { category },
              true,
            );
          }

          await page.getByTestId('template-form').getByTestId('submit').click();

          const updatedTemplates = await getTemplateDataFromTemplateList(page);
          expect(updatedTemplates).toHaveLength(initialTemplates.length + 1);
          expect(initialTemplates).not.toContain(
            `New ${transactionType} Template`,
          );
          expect(updatedTemplates).toContain(`New ${transactionType} Template`);
        };

        const expectedTemplateValues = {
          templateType: TransactionTemplateType.Auto,
          transactionType,
          name: `New ${transactionType} Template`,
          description: `New ${transactionType} Template Description`,
          toAccount: templateData({ templateType, transactionType }).toAccount,
          fromAccount: templateData({ templateType, transactionType })
            .fromAccount,
        };

        test('should add and verify an auto template without amount, dayOfMonth and dayOfMonthToCreate', async ({
          page,
        }) => {
          await createAndSubmitTemplate(page, {});
          await page
            .getByTestId('template-list')
            .getByText(`New ${transactionType} Template`)
            .click();
          const templateValues = await getTemplateFormValues(page);

          expect(templateValues).toEqual(
            expect.objectContaining(expectedTemplateValues),
          );
        });

        test('should add and verify an auto template with amount, dayOfMonth and dayOfMonthToCreate', async ({
          page,
        }) => {
          await createAndSubmitTemplate(page, {
            amount: new Decimal(1000),
            dayOfMonth: new Decimal(15),
            dayOfMonthToCreate: new Decimal(5),
          });
          await page
            .getByTestId('template-list')
            .getByText(`New ${transactionType} Template`)
            .click();
          const templateValues = await getTemplateFormValues(page);

          expect(templateValues).toEqual(
            expect.objectContaining({
              ...expectedTemplateValues,
              amount: new Decimal(1000),
              dayOfMonth: new Decimal(15),
              dayOfMonthToCreate: new Decimal(5),
            }),
          );
        });

        test('should add and verify an auto template with category', async ({
          page,
        }) => {
          await createAndSubmitTemplate(page, {
            amount: new Decimal(1000),
            category: 'Category for all types',
          });
          await page
            .getByTestId('template-list')
            .getByText(`New ${transactionType} Template`)
            .click();
          const templateValues = await getTemplateFormValues(page);

          expect(templateValues).toEqual(
            expect.objectContaining({
              ...expectedTemplateValues,
              amount: new Decimal(1000),
              categoriesCount: 1,
            }),
          );
        });
      });
    });
  });
});
