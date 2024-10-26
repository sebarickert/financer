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
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-full h-11 w-11 bg-gray hover:bg-gray-dark"
      onClick={() => setIsDialogOpen(!isDialogOpen)}
    >
      <span className="sr-only">Close dialog</span>
      <Icon name="PlusIcon" className="rotate-45 stroke-gray-darkest" />
    </button>
  );
};
