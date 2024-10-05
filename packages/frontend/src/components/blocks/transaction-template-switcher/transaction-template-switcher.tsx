'use client';

import { useTransitionRouter } from 'next-view-transitions';
import { useMemo, useState } from 'react';

import {
  TransactionType,
  useTransactionTemplatesFindAllManualTypeByUserQuery,
} from '$api/generated/financerApi';
import { Drawer } from '$blocks/drawer/drawer';
import { transactionTypeLabelMapping } from '$constants/transaction/transactionTypeMapping';
import { Button } from '$elements/button/button';
import { ButtonGroup } from '$elements/button/button.group';
import { Icon, IconName } from '$elements/icon/icon';
import { Radio } from '$elements/radio/radio';
import { RadioGroup } from '$elements/radio/radio.group';

interface TransactionTemplateSwitcherProps {
  selectedTemplate?: string;
  templateType: TransactionType;
}

export const TransactionTemplateSwitcher = ({
  selectedTemplate,
  templateType,
}: TransactionTemplateSwitcherProps): JSX.Element | null => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentData: transactionTemplates = [] } =
    useTransactionTemplatesFindAllManualTypeByUserQuery();
  const router = useTransitionRouter();

  const targetTemplates = useMemo(
    () =>
      transactionTemplates.filter(
        ({ templateVisibility }) => templateVisibility === templateType,
      ),
    [templateType, transactionTemplates],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const { templateSwitcher } = event.target;
    const selectedTemplateId = templateSwitcher.value;
    router.push(
      `/statistics/${transactionTypeLabelMapping[templateType].plural}/add/${selectedTemplateId}`,
    );
    setIsOpen(false);
  };

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  if (!targetTemplates.length) return null;

  return (
    <>
      <Button
        applyBaseStyles={false}
        accentColor="unstyled"
        onClick={handleToggleOpen}
        className="inline-flex items-center justify-center -mr-3 h-11 w-11"
      >
        <span className="sr-only">Switch template</span>
        <Icon type={IconName.lightningBolt} />
      </Button>
      <Drawer isOpen={isOpen} onClose={onClose} heading="Switch template">
        <form onSubmit={handleSubmit}>
          <section className="-mx-4">
            <RadioGroup>
              <Radio
                name="templateSwitcher"
                value={''}
                isChecked={!selectedTemplate}
              >
                Empty
              </Radio>
              {targetTemplates.map(({ id, templateName }) => (
                <Radio
                  name="templateSwitcher"
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
            <Button onClick={() => setIsOpen(false)} accentColor="plain">
              Cancel
            </Button>
          </ButtonGroup>
        </form>
      </Drawer>
    </>
  );
};
