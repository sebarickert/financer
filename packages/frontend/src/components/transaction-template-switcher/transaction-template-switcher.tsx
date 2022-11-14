import { TransactionType, TransactionTypeMapping } from '@local/types';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAllManualTransactionTemplates } from '../../hooks/transactionTemplate/useAllTransactionTemplates';
import { Button } from '../button/button';
import { ButtonGroup } from '../button/button.group';
import { ButtonPlain } from '../button/button.plain';
import { Dialog } from '../elements/dialog/dialog';
import { DialogText } from '../elements/dialog/dialog.text';
import { Icon, IconName } from '../icon/icon';
import { Radio } from '../radio/radio';
import { RadioGroup } from '../radio/radio.group';

interface TransactionTemplateSwitcherProps {
  selectedTemplate?: string;
  templateType: Exclude<TransactionType, 'ANY'>;
}

export const TransactionTemplateSwitcher = ({
  selectedTemplate,
  templateType,
}: TransactionTemplateSwitcherProps): JSX.Element | null => {
  const [isOpen, setIsOpen] = useState(false);
  const transactionTemplates = useAllManualTransactionTemplates();
  const targetTemplates = useMemo(
    () =>
      transactionTemplates.filter(
        ({ templateVisibility }) => templateVisibility === templateType
      ),
    [templateType, transactionTemplates]
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const { templateSwitcher } = event.target;
    const selectedTemplateId = templateSwitcher.value;
    navigate(
      `/statistics/${TransactionTypeMapping[templateType]}/add/${selectedTemplateId}`
    );
    setIsOpen(false);
  };

  const handleToggleOpen = () => setIsOpen(!isOpen);

  if (!targetTemplates.length) return null;

  return (
    <>
      <ButtonPlain
        onClick={handleToggleOpen}
        className="relative flex items-center justify-center w-full h-full gap-1 overflow-hidden rounded-full focus-within:bg-gray-50 hover:bg-gray-100 lg:pl-2 lg:rounded-md bg-gray-50"
      >
        <Icon
          type={IconName.lightningBolt}
          className="flex-shrink-0 pointer-events-none stroke-black"
        />
        <span className="flex items-center justify-between flex-1 overflow-hidden text-base font-semibold tracking-tight sr-only lg:not-sr-only lg:py-2 lg:pr-3">
          <span className="truncate">Switch</span>
        </span>
      </ButtonPlain>
      <Dialog isDialogOpen={isOpen} setIsDialogOpen={setIsOpen}>
        <DialogText label="Switch template" className="mb-4" />
        <form onSubmit={handleSubmit}>
          <section className="mb-6">
            <RadioGroup className="-mx-2">
              <Radio
                name="templateSwitcher"
                value={''}
                isChecked={!selectedTemplate}
              >
                Empty
              </Radio>
              {targetTemplates.map(({ _id: id, templateName }) => (
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
          <ButtonGroup className="" isReverse>
            <Button type="submit">Update</Button>
            <Button onClick={() => setIsOpen(false)} accentColor="plain">
              Cancel
            </Button>
          </ButtonGroup>
        </form>
      </Dialog>
    </>
  );
};
