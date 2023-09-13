import accountsOnly from "$assets/accounts-only_fixture-data.json"
import empty from "$assets/empty_fixture-data.json"
import large from "$assets/large_fixture-data.json"
import small from "$assets/small_fixture-data.json"
import { Page } from "@playwright/test"

type FixtureType = 'large' | 'small' | 'empty' | 'accounts-only'

const getFixture = (fixtureType: FixtureType) => {
    switch (fixtureType) {
        case 'large':
            return large
        case 'small':
            return small
        case 'empty':
            return empty
        case 'accounts-only':
            return accountsOnly
    }
}

export const applyFixture = async (fixtureType: FixtureType) => {
    const fixture = getFixture(fixtureType)
  
    return fetch('http://localhost:3000/api/users/my-user/my-data', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fixture),
    });
  };
