import { AccountType } from '@local/types';

import { IconName } from '$elements/icon/icon';

export const accountTypeIconMapping: { [key in AccountType]: IconName } = {
  cash: IconName.cash,
  savings: IconName.star,
  investment: IconName.trendingUp,
  credit: IconName.creditCard,
  loan: IconName.library,
  'long-term savings': IconName.star,
  'pre-assigned cash': IconName.paperAirplane,
};
