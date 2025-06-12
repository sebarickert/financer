'use client';

import { Layers } from 'lucide-react';
import { type JSX, useId, useMemo, useRef } from 'react';

import {
  SchemaTransactionTemplateDto,
  TransactionTemplateType,
  TransactionType,
} from '@/api/ssr-financer-api';
import { Drawer } from '@/blocks/Drawer';
import { Button } from '@/elements/Button/Button';
import { ButtonGroup } from '@/elements/Button/ButtonGroup';
import { InputOption } from '@/elements/InputOption';

interface TransactionTemplateSwitcherProps {
  selectedTemplateId?: string;
  transactionType: TransactionType;
  onChange: (event: React.ChangeEvent<HTMLFormElement>) => void;
  name?: string;
  transactionTemplates?: SchemaTransactionTemplateDto[];
}

export const TransactionTemplateSwitcher = ({
  selectedTemplateId,
  transactionType,
  onChange,
  name,
  transactionTemplates = [],
}: TransactionTemplateSwitcherProps): JSX.Element | null => {
  const drawerRef = useRef<HTMLDialogElement>(null);
  const templateSwitcherId = useId();

  const targetTemplates = useMemo(
    () =>
      transactionTemplates.filter(
        ({ templateVisibility, templateType }) =>
          templateVisibility === transactionType &&
          templateType[0] === TransactionTemplateType.MANUAL,
      ),
    [transactionType, transactionTemplates],
  );

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    onChange(event);
    drawerRef.current?.close();
  };

  return (
    <>
      <Button
        accentColor="secondary"
        size="icon"
        commandFor={templateSwitcherId}
        command="show-modal"
        isDisabled={!targetTemplates.length}
        testId="use-template-button"
      >
        <Layers />
        <span className="sr-only">Use Template</span>
      </Button>
      <Drawer id={templateSwitcherId} heading="Use Template" ref={drawerRef}>
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
              command="close"
              commandFor={templateSwitcherId}
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
