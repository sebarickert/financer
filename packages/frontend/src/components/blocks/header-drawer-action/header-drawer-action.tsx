'use client';

import { useId } from 'react';

import { Drawer } from '$blocks/drawer/drawer';
import { Button, ButtonAccentColor } from '$elements/button/button';
import { ButtonGroup } from '$elements/button/button.group';
import { Icon, IconName } from '$elements/Icon';

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
  const id = useId();

  return (
    <>
      <Button
        applyBaseStyles={false}
        accentColor="unstyled"
        testId={buttonTestId}
        className="inline-flex items-center justify-center rounded-md h-11 w-11 theme-layer-color-with-hover theme-text-primary theme-focus"
        popoverTarget={id}
      >
        <span className="sr-only">{buttonLabel}</span>
        <Icon name={buttonIcon} />
      </Button>
      <Drawer id={id} heading={drawerHeading} description={drawerDescription}>
        <ButtonGroup isReverse isHorizontal>
          <Button
            accentColor={drawerButtonAccentColor}
            onClick={() => onSubmit()}
            testId={`${buttonTestId}-confirm`}
          >
            {drawerButtonLabel}
          </Button>
          <Button
            accentColor="secondary"
            testId={`${buttonTestId}-cancel`}
            popoverTargetAction="hide"
            popoverTarget={id}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Drawer>
    </>
  );
};
