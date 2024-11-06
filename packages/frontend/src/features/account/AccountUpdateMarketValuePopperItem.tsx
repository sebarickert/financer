'use client';

import clsx from 'clsx';
import { FC, useId } from 'react';
import { useForm } from 'react-hook-form';

import { AccountDto } from '$api/generated/financerApi';
import { Drawer } from '$blocks/drawer/drawer';
import { Form } from '$blocks/form/form';
import { Icon } from '$elements/Icon';
import { Input } from '$elements/input/input';
import { useFinancerFormState } from '$hooks/useFinancerFormState';
import { UserDefaultMarketUpdateSettings } from '$ssr/api/user-preference.service';
import { DateFormat, formatDate } from '$utils/formatDate';
import { handleAccountMarketValueUpdate } from 'src/actions/account/handleAccountMarketValueUpdate';

type AccountUpdateMarketValuePopperItemProps = {
  account: AccountDto;
  marketSettings?: UserDefaultMarketUpdateSettings;
};

type AccountUpdateMarketValueFormFields = {
  currentMarketValue: number;
  date: string;
};

export const AccountUpdateMarketValuePopperItem: FC<
  AccountUpdateMarketValuePopperItemProps
> = ({ account, marketSettings }) => {
  const popperId = useId();

  const methods = useForm<AccountUpdateMarketValueFormFields>({
    defaultValues: {
      currentMarketValue: account.balance,
      date: formatDate(new Date(), DateFormat.input),
    },
  });

  const handleUpdate = handleAccountMarketValueUpdate.bind(null, {
    account,
    marketSettings,
  });

  const action = useFinancerFormState('update-market-value', handleUpdate);

  return (
    <>
      <button
        className={clsx(
          'flex w-full items-center gap-2 px-2 py-1.5 theme-focus theme-bg-color-with-hover',
        )}
        // @ts-expect-error popovertarget is not a valid prop
        popovertarget={popperId}
      >
        <Icon name={'ArrowTrendingUpIcon'} className="!w-5 !h-5" />
        <span className="inline-block pr-2">Update Market Value</span>
      </button>
      {/* TODO Drawer should close after submission */}
      <Drawer
        id={popperId}
        heading={'Update Market Value'}
        testId="update-market-value"
      >
        <Form
          methods={methods}
          action={action}
          submitLabel="Update"
          testId="update-market-value-form"
        >
          <div className="space-y-4">
            <Input id="currentMarketValue" type="number" step={0.01} isRequired>
              Current Market Value
            </Input>
            <Input id="date" type="datetime-local">
              Date
            </Input>
          </div>
        </Form>
      </Drawer>
    </>
  );
};
