import Decimal from 'decimal.js';

import { formatDate } from '$utils/api-helper';
import { Page } from '$utils/financer-page';

interface MarketValueFormFields {
  date?: Date;
  currentMarketValue?: Decimal;
}

export const fillUpdateMarketValueForm = async (
  page: Page,
  fields: MarketValueFormFields,
) => {
  const { currentMarketValue, date } = fields;

  const formFields = {
    '#currentMarketValue': currentMarketValue?.toNumber(),
    '#date': date ? formatDate(date) : null,
  };

  const accountForm = page.getByTestId('update-market-value-form');

  for (const [selector, value] of Object.entries(formFields)) {
    if (value) {
      await accountForm.locator(selector).fill(value.toString());
    }
  }
};
