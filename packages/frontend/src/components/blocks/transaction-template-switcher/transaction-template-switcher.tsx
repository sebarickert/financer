import { TransactionType, TransactionTypeMapping } from '@local/types';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAllManualTransactionTemplates } from '../../../hooks/transactionTemplate/useAllTransactionTemplates';
import { Button } from '../../elements/button/button';
import { ButtonGroup } from '../../elements/button/button.group';
import { ButtonPlain } from '../../elements/button/button.plain';
import { Dialog } from '../../elements/dialog/dialog';
import { DialogText } from '../../elements/dialog/dialog.text';
import { Icon, IconName } from '../../elements/icon/icon';
import { Radio } from '../../elements/radio/radio';
import { RadioGroup } from '../../elements/radio/radio.group';

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
        className="inline-flex items-center justify-center border rounded-full h-11 w-11 bg-gray hover:bg-gray-dark text-gray-darkest focus:ring-2 focus:ring-offset-2 focus:outline-none focus:ring-charcoal border-gray-dark"
      >
        <span className="sr-only">Switch template</span>
        <Icon type={IconName.lightningBolt} />
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