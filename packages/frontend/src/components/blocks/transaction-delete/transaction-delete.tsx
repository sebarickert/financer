import { useState } from 'react';

import { Drawer } from '$blocks/drawer/drawer';
import { Button } from '$elements/button/button';
import { ButtonGroup } from '$elements/button/button.group';
import { ButtonPlain } from '$elements/button/button.plain';
import { Icon, IconName } from '$elements/icon/icon';

interface TransactionDeleteProps {
  onDelete: () => void;
}

export const TransactionDelete = ({ onDelete }: TransactionDeleteProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCancel = () => {
    setIsOpen(!isOpen);
  };

  const handleToggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      <ButtonPlain
        onClick={handleToggleOpen}
        testId="delete-transaction"
        className="inline-flex items-center justify-center -mr-3 h-11 w-11"
      >
        <span className="sr-only">Delete transaction</span>
        <Icon type={IconName.trash} />
      </ButtonPlain>
      <Drawer
        isOpen={isOpen}
        onClose={handleCancel}
        heading="Delete Transaction"
        description="Are you sure you want to permanently delete this transaction?"
      >
        <ButtonGroup isReverse isHorizontal>
          <Button className="sm:mt-6" accentColor="red" onClick={onDelete}>
            Delete
          </Button>
          <Button
            className="sm:mt-6"
            onClick={handleCancel}
            accentColor="plain"
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Drawer>
    </>
  );
};
