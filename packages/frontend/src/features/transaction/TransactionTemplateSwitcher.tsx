'use client';

import { Layers } from 'lucide-react';
import { useId, useMemo, useRef, type JSX } from 'react';

import {
  TransactionTemplateDto,
  TransactionTemplateType,
  TransactionType,
} from '$api/generated/financerApi';
import { Drawer } from '$blocks/Drawer';
import { Button } from '$elements/Button/Button';
import { ButtonGroup } from '$elements/Button/ButtonGroup';
import { InputOption } from '$elements/InputOption';

type TransactionTemplateSwitcherProps = {
  selectedTemplateId?: string;
  transactionType: TransactionType;
  onChange(event: React.ChangeEvent<HTMLFormElement>): void;
  name?: string;
  transactionTemplates?: TransactionTemplateDto[];
};

export const TransactionTemplateSwitcher = ({
  selectedTemplateId,
  transactionType,
  onChange,
  name,
  transactionTemplates = [],
}: TransactionTemplateSwitcherProps): JSX.Element | null => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const templateSwitcherId = useId();

  const targetTemplates = useMemo(
    () =>
      transactionTemplates.filter(
        ({ templateVisibility, templateType }) =>
          templateVisibility === transactionType &&
          templateType[0] === TransactionTemplateType.Manual,
      ),
    [transactionType, transactionTemplates],
  );

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    onChange(event);
    popoverRef?.current?.hidePopover();
  };

  return (
    <>
      <Button
        accentColor="secondary"
        size="icon"
        popoverTarget={templateSwitcherId}
        isDisabled={!targetTemplates.length}
        testId="use-template-button"
      >
        <Layers />
        <span className="sr-only">Use Template</span>
      </Button>
      <Drawer id={templateSwitcherId} heading="Use Template" ref={popoverRef}>
        <form onSubmit={handleSubmit} data-testid="transaction-templates-form">
          <fieldset className="grid gap-2">
            <legend className="sr-only">Choose Template</legend>
            <InputOption
              id={name ?? 'templateSwitcher'}
              value={''}
              defaultChecked={!selectedTemplateId}
              type="radio"
            >
              Empty
            </InputOption>
            {targetTemplates.map(({ id, templateName }) => (
              <InputOption
                id={name ?? 'templateSwitcher'}
                value={id}
                key={id}
                defaultChecked={id === selectedTemplateId}
                type="radio"
              >
                {templateName}
              </InputOption>
            ))}
          </fieldset>
          <ButtonGroup className="mt-12">
            <Button type="submit">Switch</Button>
            <Button
              popoverTargetAction="hide"
              popoverTarget={templateSwitcherId}
              accentColor="secondary"
            >
              Cancel
            </Button>
          </ButtonGroup>
        </form>
      </Drawer>
    </>
  );
};
