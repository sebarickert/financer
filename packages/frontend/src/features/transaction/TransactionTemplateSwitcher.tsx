'use client';

import { useId, useMemo, useRef } from 'react';

import {
  TransactionType,
  useTransactionTemplatesFindAllManualTypeByUserQuery,
} from '$api/generated/financerApi';
import { Drawer } from '$blocks/drawer/drawer';
import { Button } from '$elements/button/button';
import { ButtonGroup } from '$elements/button/button.group';
import { Icon } from '$elements/Icon';
import { Radio } from '$elements/radio/radio';
import { RadioGroup } from '$elements/radio/radio.group';

interface TransactionTemplateSwitcherProps {
  selectedTemplate?: string;
  templateType: TransactionType;
  onChange(event: React.ChangeEvent<HTMLFormElement>): void;
  name?: string;
}

export const TransactionTemplateSwitcher = ({
  selectedTemplate,
  templateType,
  onChange,
  name,
}: TransactionTemplateSwitcherProps): JSX.Element | null => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const templateSwitcherId = useId();
  const { currentData: transactionTemplates = [] } =
    useTransactionTemplatesFindAllManualTypeByUserQuery();

  const targetTemplates = useMemo(
    () =>
      transactionTemplates.filter(
        ({ templateVisibility }) => templateVisibility === templateType,
      ),
    [templateType, transactionTemplates],
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
        className="!w-[50px] !p-0 inline-flex justify-center items-center"
        popoverTarget={templateSwitcherId}
        size="small"
        isDisabled={!targetTemplates.length}
        testId="use-template-button"
      >
        <Icon name="BoltIcon" />
        <span className="sr-only">Use Template</span>
      </Button>
      <Drawer id={templateSwitcherId} heading="Use Template" ref={popoverRef}>
        <form onSubmit={handleSubmit} data-testid="transaction-templates-form">
          <section className="-mx-4">
            <RadioGroup>
              <Radio
                name={name ?? 'templateSwitcher'}
                value={''}
                isChecked={!selectedTemplate}
              >
                Empty
              </Radio>
              {targetTemplates.map(({ id, templateName }) => (
                <Radio
                  name={name ?? 'templateSwitcher'}
                  value={id}
                  key={id}
                  isChecked={id === selectedTemplate}
                >
                  {templateName}
                </Radio>
              ))}
            </RadioGroup>
          </section>
          <ButtonGroup className="mt-12" isReverse isHorizontal>
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