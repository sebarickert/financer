import { useState } from 'react';

import { Drawer } from '$blocks/drawer/drawer';
import { Button } from '$elements/button/button';
import { ButtonGroup } from '$elements/button/button.group';
import { ButtonPlain } from '$elements/button/button.plain';
import { Icon, IconName } from '$elements/icon/icon';

interface AccountDeleteProps {
  onDelete: () => void;
}

export const AccountDelete = ({ onDelete }: AccountDeleteProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      <ButtonPlain
        onClick={handleToggleOpen}
        testId="delete-account"
        className="inline-flex items-center justify-center -mr-3 h-11 w-11"
      >
        <span className="sr-only">Delete account</span>
        <Icon type={IconName.trash} />
      </ButtonPlain>
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
