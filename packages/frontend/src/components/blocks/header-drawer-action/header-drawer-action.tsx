import { useState } from 'react';

import { Drawer } from '$blocks/drawer/drawer';
import { Button, ButtonAccentColor } from '$elements/button/button';
import { ButtonGroup } from '$elements/button/button.group';
import { ButtonPlain } from '$elements/button/button.plain';
import { Icon, IconName } from '$elements/icon/icon';

interface HeaderDrawerActionProps {
  onSubmit: () => void;
  buttonLabel: string;
  buttonTestId?: string;
  buttonIcon: IconName;
  drawerHeading: string;
  drawerDescription?: string;
  drawerButtonAccentColor: ButtonAccentColor;
  drawerButtonLabel: string;
}

export const HeaderDrawerAction = ({
  onSubmit,
  buttonIcon,
  buttonLabel,
  buttonTestId,
  drawerButtonAccentColor,
  drawerButtonLabel,
  drawerHeading,
  drawerDescription,
}: HeaderDrawerActionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <>
      <ButtonPlain
        onClick={handleToggle}
        testId={buttonTestId}
        className="inline-flex items-center justify-center -mr-3 h-11 w-11"
      >
        <span className="sr-only">{buttonLabel}</span>
        <Icon type={buttonIcon} />
      </ButtonPlain>
      <Drawer
        isOpen={isOpen}
        onClose={handleToggle}
        heading={drawerHeading}
        description={drawerDescription}
      >
        <ButtonGroup isReverse isHorizontal>
          <Button
            accentColor={drawerButtonAccentColor}
            onClick={onSubmit}
            testId={`${buttonTestId}-confirm`}
          >
            {drawerButtonLabel}
          </Button>
          <Button
            onClick={handleToggle}
            accentColor="plain"
            testId={`${buttonTestId}-cancel`}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Drawer>
    </>
  );
};
