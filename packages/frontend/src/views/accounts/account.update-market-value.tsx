'use client';

import { useId } from 'react';
import { useForm } from 'react-hook-form';

import { Drawer } from '$blocks/drawer/drawer';
import { Form } from '$blocks/form/form';
import { Button } from '$elements/button/button';
import { Input } from '$elements/input/input';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '$hooks/useFinancerFormState';
import { DateFormat, formatDate } from '$utils/formatDate';

interface AccountUpdateMarketValueProps {
  onUpdate: DefaultFormActionHandler;
  currentValue: number;
}

export interface AccountUpdateMarketValueFormFields {
  currentMarketValue: number;
  date: string;
}

export const AccountUpdateMarketValue = ({
  onUpdate,
  currentValue,
}: AccountUpdateMarketValueProps) => {
  const formId = useId();
  const methods = useForm<AccountUpdateMarketValueFormFields>({
    defaultValues: {
      currentMarketValue: currentValue,
      date: formatDate(new Date(), DateFormat.input),
    },
  });

  const action = useFinancerFormState('update-market-value', onUpdate);

  return (
    <>
      <Button testId="update-market-value" popoverTarget={formId}>
        Update market value
      </Button>
      <Drawer id={formId} heading="Update Market Value">
        <Form methods={methods} action={action} submitLabel="Update">
          <div className="space-y-4">
            <Input id="currentMarketValue" type="number" isRequired>
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
