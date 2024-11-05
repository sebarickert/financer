import { getBaseUrl } from './financer-page';

import accountsOnly from '$assets/accounts-only_fixture-data.json';
import large from '$assets/large_fixture-data.json';

type FixtureType = 'large' | 'accounts-only';

const getFixture = (fixtureType: FixtureType) => {
  switch (fixtureType) {
    case 'large':
      return large;
    case 'accounts-only':
      return accountsOnly;
  }
};

export const applyFixture = async (fixtureType: FixtureType) => {
  const fixture = getFixture(fixtureType);

  const baseUrl = getBaseUrl();

  return fetch(`${baseUrl}/api/users/my-user/my-data`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fixture),
  });
};
