'use client';

import { FC, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { handleAccountMarketValueUpdate } from '@/actions/account/handleAccountMarketValueUpdate';
import { SchemaAccountDto } from '@/api/ssr-financer-api';
import { UserDefaultMarketUpdateSettings } from '@/api-service';
import { Drawer } from '@/blocks/Drawer';
import { Form } from '@/blocks/Form';
import { Button } from '@/elements/Button/Button';
import { Input } from '@/elements/Input';
import { useFinancerFormState } from '@/hooks/useFinancerFormState';
import { DATE_FORMAT, DateService } from '@/services/DateService';
interface AccountUpdateMarketValueDrawerProps {
  account: SchemaAccountDto;
  marketSettings?: UserDefaultMarketUpdateSettings;
  drawerId: string;
}

interface AccountUpdateMarketValueFormFields {
  currentMarketValue: number;
  date: string;
}

export const AccountUpdateMarketValueDrawer: FC<
  AccountUpdateMarketValueDrawerProps
> = ({ account, marketSettings, drawerId }) => {
  const drawerRef = useRef<HTMLDialogElement>(null);

  const methods = useForm<AccountUpdateMarketValueFormFields>({
    defaultValues: {
      currentMarketValue: account.balance,
      date: new DateService().format(DATE_FORMAT.INPUT),
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
      drawerRef?.current?.close();
    },
  );

  return (
    <Drawer
      id={drawerId}
      heading={'Update Market Value'}
      testId="update-market-value"
      ref={drawerRef}
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
