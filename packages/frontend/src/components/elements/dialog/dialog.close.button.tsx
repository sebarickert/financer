import { X } from 'lucide-react';

import { Button } from '$elements/Button/Button';

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
      <X />
    </Button>
  );
};
