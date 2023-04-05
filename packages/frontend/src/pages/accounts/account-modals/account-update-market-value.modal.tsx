import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Dialog } from '../../../components/elements/dialog/dialog';
import { IconName } from '../../../components/elements/icon/icon';
import { Input } from '../../../components/elements/input/input';
import { LinkListButton } from '../../../components/elements/link-list/link-list.button';

import { Form } from '$blocks/form/form';
import { inputDateFormat } from '$utils/formatDate';

interface AccountUpdateMarketValueModalProps {
  onUpdate: (
    closeDialog: () => void
  ) => SubmitHandler<AccountUpdateMarketValueModalFormFields>;
  currentValue: number;
}

export interface AccountUpdateMarketValueModalFormFields {
  currentMarketValue: number;
  date: string;
}

export const AccountUpdateMarketValueModal = ({
  onUpdate,
  currentValue,
}: AccountUpdateMarketValueModalProps) => {
  const methods = useForm<AccountUpdateMarketValueModalFormFields>({
    defaultValues: {
      currentMarketValue: currentValue,
      date: inputDateFormat(new Date()),
    },
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      <LinkListButton icon={IconName.trendingUp} handleClick={handleToggleOpen}>
        Update current market value
      </LinkListButton>
      <Dialog isDialogOpen={isOpen} setIsDialogOpen={setIsOpen}>
        <Form
          methods={methods}
          onSubmit={onUpdate(() => setIsOpen(false))}
          submitLabel="Update"
        >
          <div className="space-y-4">
            <Input id="currentMarketValue" type="number" isRequired>
              Current market value
            </Input>
            <Input id="date" type="datetime-local">
              Date
            </Input>
          </div>
        </Form>
      </Dialog>
    </>
  );
};
