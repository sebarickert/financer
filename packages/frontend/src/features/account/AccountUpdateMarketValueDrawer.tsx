'use client';

import { FC, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { AccountDto } from '$api/generated/financerApi';
import { Drawer } from '$blocks/Drawer';
import { Form } from '$blocks/Form';
import { Button } from '$elements/Button/Button';
import { Input } from '$elements/Input';
import { useFinancerFormState } from '$hooks/useFinancerFormState';
import { UserDefaultMarketUpdateSettings } from '$ssr/api/user-preference.service';
import { DateFormat, formatDate } from '$utils/formatDate';
import { handleAccountMarketValueUpdate } from 'src/actions/account/handleAccountMarketValueUpdate';

type AccountUpdateMarketValueDrawerProps = {
  account: AccountDto;
  marketSettings?: UserDefaultMarketUpdateSettings;
  popperId: string;
};

type AccountUpdateMarketValueFormFields = {
  currentMarketValue: number;
  date: string;
};

export const AccountUpdateMarketValueDrawer: FC<
  AccountUpdateMarketValueDrawerProps
> = ({ account, marketSettings, popperId }) => {
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
    <Drawer
      id={popperId}
      heading={'Update Market Value'}
      testId="update-market-value"
      ref={popperRef}
    >
      <Form methods={methods} action={action} testId="update-market-value-form">
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
  );
};
