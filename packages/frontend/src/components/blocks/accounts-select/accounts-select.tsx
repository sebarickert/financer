import clsx from 'clsx';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { AccountsSelectOption } from './accounts-select.option';

import { useAccountsFindOneByIdQuery } from '$api/generated/financerApi';
import { Icon, IconName } from '$elements/icon/icon';
import { Option } from '$elements/select/select';
import { useOnClickOutside } from '$hooks/useOnClickOutside';
import { formatCurrency } from '$utils/formatCurrency';

interface AccountsSelectProps {
  children: React.ReactNode;
  help?: string;
  id: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  options: Option[];
  defaultValue?: string;
  className?: string;
  handleOnChange?(event: React.ChangeEvent<HTMLSelectElement>): void;
  testId?: string;
}

export const AccountsSelect = ({ id, options }: AccountsSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { watch } = useFormContext();
  const optionListRef = useRef<HTMLUListElement>(null);
  const selectedItemRef = useRef<HTMLLabelElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const targetRefs = useMemo(
    () => [optionListRef, buttonRef],
    [optionListRef, buttonRef]
  );

  useOnClickOutside(targetRefs, () => setIsOpen(false));

  const accountId = watch(id);
  const data = useAccountsFindOneByIdQuery({ id: accountId });
  const account = data.data;

  const buttonContent =
    !!accountId && account ? (
      <span className="grid gap-0.5 text-base font-medium leading-none tracking-tight">
        <span>{account.name}</span>
        <span className="text-xs font-light tracking-wide text-black/75">
          {formatCurrency(account.balance)}
        </span>
      </span>
    ) : (
      <span className="text-base font-medium tracking-tight">
        Select account
      </span>
    );

  useEffect(() => {
    if (!isOpen) return;

    selectedItemRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!accountId || !isOpen) return;

    selectedItemRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [accountId, isOpen]);

  return (
    <section className="relative z-10">
      <button
        ref={buttonRef}
        aria-expanded={isOpen}
        onClick={() => {
          if (isOpen) return;

          setIsOpen(true);
        }}
        onFocus={(event) => {
          if (!isOpen || event.currentTarget === event.relatedTarget) return;

          setTimeout(() => setIsOpen(false), 75);
        }}
        className="grid grid-cols-[44px,1fr,24px] gap-4 text-left items-center w-full p-2 border hover:bg-gray-dark border-transparent rounded-md bg-gray text-charcoal focus:outline-none hover:cursor-pointer focus:ring-black focus:border-black"
        type="button"
      >
        <span className="inline-flex items-center justify-center h-11 w-11">
          <Icon type={IconName.download} className="text-black/75 h-11 w-11" />
        </span>
        <div className="truncate">{buttonContent}</div>
        <Icon type={IconName.chevronDown} className="text-black/75" />
      </button>
      <ul
        onBlur={(event) => {
          const isSelf = event.currentTarget === event.relatedTarget;
          const isChild = Array.from(event.currentTarget.childNodes).some(
            (child) => child.contains(event.relatedTarget)
          );
          const isButton = event.relatedTarget === buttonRef.current;

          if (isSelf || isChild || isButton) return;

          setTimeout(() => setIsOpen(false), 0);
        }}
        ref={optionListRef}
        aria-hidden={!isOpen}
        className={clsx(
          'absolute w-full mt-1 border divide-y-[1px] divide-gray-dark rounded-md top-full bg-gray border-gray-dark max-h-[17rem] overflow-auto aria-hidden:hidden aria-hidden:invisible'
        )}
        tabIndex={-1}
      >
        {options.map((option) => (
          <AccountsSelectOption
            parentId={id}
            {...option}
            key={option.value}
            onClose={() => {
              setIsOpen(false);
              buttonRef.current?.focus();
            }}
            activeItemRef={
              accountId === option.value ? selectedItemRef : undefined
            }
          />
        ))}
      </ul>
    </section>
  );
};
