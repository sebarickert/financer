import { useState } from 'react';

import { Drawer } from '$blocks/drawer/drawer';
import { Button } from '$elements/button/button';
import { ButtonGroup } from '$elements/button/button.group';

interface AccountDeleteProps {
  onDelete: () => void;
}

export const AccountDelete = ({ onDelete }: AccountDeleteProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      <Button
        accentColor="red"
        testId="delete-account"
        onClick={handleToggleOpen}
      >
        Delete
      </Button>
      <Drawer
        isOpen={isOpen}
        onClose={handleToggleOpen}
        heading="Delete Account"
        description="Are you sure you want to permanently delete this account?"
      >
        <ButtonGroup isReverse isHorizontal>
          <Button className="sm:mt-6" accentColor="red" onClick={onDelete}>
            Delete
          </Button>
          <Button
            className="sm:mt-6"
            onClick={handleToggleOpen}
            accentColor="plain"
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Drawer>
    </>
  );
};
