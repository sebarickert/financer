import { useMemo, RefObject, useCallback, KeyboardEvent } from 'react';
import { useFormContext } from 'react-hook-form';

import { Option } from '$elements/select/select';

interface AccountSelectOptionsProps extends Option {
  parentId: string;
  activeItemRef?: RefObject<HTMLLabelElement>;
  onClose: () => void;
}

export const AccountsSelectOption = ({
  label,
  value,
  parentId,
  activeItemRef,
  onClose,
}: AccountSelectOptionsProps) => {
  const { register } = useFormContext();
  const id = useMemo(() => crypto.randomUUID(), []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === ' ' || event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <li>
      <input
        tabIndex={-1}
        type="radio"
        className="fixed -top-64 -left-64 peer"
        id={id}
        value={value}
        {...register(parentId)}
        onKeyDown={handleKeyDown}
      />
      <label
        ref={activeItemRef}
        onClick={onClose}
        htmlFor={id}
        className="block w-full p-3 text-sm text-left hover:bg-gray-dark hover:cursor-pointer peer-checked:bg-gray-dark"
      >
        {label}
      </label>
    </li>
  );
};
