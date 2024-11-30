'use client';

import clsx from 'clsx';
import { FC, useId, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { AccountDto } from '$api/generated/financerApi';
import { Drawer } from '$blocks/Drawer';
import { Form } from '$blocks/Form';
import { Button } from '$elements/Button/Button';
import { Icon } from '$elements/Icon';
import { Input } from '$elements/Input';
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
  const popperRef = useRef<HTMLDivElement>(null);

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

  const action = useFinancerFormState(
    'update-market-value',
    handleUpdate,
    () => {
      popperRef?.current?.hidePopover();
    },
  );

  return (
    <>
      <Button
        accentColor="unstyled"
        popoverTarget={popperId}
        className={clsx(
          'py-2.5 h-11 px-[18px] text-base text-foreground',
          'w-full !justify-start hover:bg-accent',
          '!pl-2',
        )}
      >
        <Icon name={'ArrowTrendingUpIcon'} />
        <span className="inline-block pr-2">Update Market Value</span>
      </Button>
      <Drawer
        id={popperId}
        heading={'Update Market Value'}
        testId="update-market-value"
        ref={popperRef}
      >
        <Form
          methods={methods}
          action={action}
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
          <Form.Footer>
            <Button type="submit">Update</Button>
          </Form.Footer>
        </Form>
      </Drawer>
    </>
  );
};
