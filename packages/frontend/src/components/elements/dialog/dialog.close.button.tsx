import { Button } from '$elements/Button1/Button';
import { Icon } from '$elements/Icon';

interface DialogCloseButtonProps {
  isDialogOpen?: boolean;
  setIsDialogOpen: (state: boolean) => void;
}

export const DialogCloseButton = ({
  setIsDialogOpen,
  isDialogOpen,
}: DialogCloseButtonProps) => {
  return (
    <Button
      onClick={() => setIsDialogOpen(!isDialogOpen)}
      accentColor="secondary"
      size="icon"
    >
      <span className="sr-only">Close dialog</span>
      <Icon name="XMarkIcon" />
    </Button>
  );
};
