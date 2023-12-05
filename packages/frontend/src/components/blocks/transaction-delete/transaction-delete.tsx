import { useState } from 'react';

import { Drawer } from '$blocks/drawer/drawer';
import { Button } from '$elements/button/button';
import { ButtonGroup } from '$elements/button/button.group';

interface TransactionDeleteProps {
  onDelete: () => void;
}

export const TransactionDelete = ({ onDelete }: TransactionDeleteProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCancel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button
        className="mt-12"
        accentColor="red"
        testId="transaction-delete-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        Delete
      </Button>
      <Drawer
        isOpen={isOpen}
        onClose={handleCancel}
        heading="Delete transaction"
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
