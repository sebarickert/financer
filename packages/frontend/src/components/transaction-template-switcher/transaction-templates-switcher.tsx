import { TransactionType, TransactionTypeMapping } from '@local/types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAllManualTransactionTemplates } from '../../hooks/transactionTemplate/useAllTransactionTemplates';
import { Button } from '../button/button';
import { ButtonGroup } from '../button/button.group';
import { ButtonPlain } from '../button/button.plain';
import { Heading } from '../heading/heading';
import { Icon, IconName } from '../icon/icon';
import { Radio } from '../radio/radio';
import { RadioGroup } from '../radio/radio.group';

interface TransactionTemplatesSwitcherProps {
  selectedTemplate?: string;
  templateType: Exclude<TransactionType, 'ANY'>;
}

export const TransactionTemplatesSwitcher = ({
  selectedTemplate,
  templateType,
}: TransactionTemplatesSwitcherProps): JSX.Element | null => {
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
  const ref: any = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const current = ref.current;

    const closeModal = () => {
      setIsOpen(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clickOutside = (event: any) => {
      if (event.target === current) {
        current?.close();
      }
    };

    if (isOpen) {
      current?.showModal?.();
    } else {
      current?.close();
    }

    current?.addEventListener('close', closeModal);
    current?.addEventListener('click', clickOutside);

    return () => {
      current?.removeEventListener('close', closeModal);
      current?.removeEventListener('close', clickOutside);
    };
  }, [isOpen]);

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

  if (!targetTemplates.length) return null;

  return (
    <>
      <ButtonPlain
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex gap-1 justify-center items-center focus-within:bg-gray-100 hover:bg-gray-100 overflow-hidden lg:pl-2 lg:rounded-md h-full w-full"
      >
        <Icon
          type={IconName.lightningBolt}
          className="stroke-black flex-shrink-0 pointer-events-none"
        />
        <span className="sr-only lg:not-sr-only flex text-base items-center justify-between font-semibold tracking-tight lg:py-2 lg:pr-3 flex-1 overflow-hidden">
          <span className="truncate">Switch</span>
        </span>
      </ButtonPlain>
      <dialog
        className="bg-white z-10 border rounded-md p-0 w-full lg:max-w-screen-sm"
        ref={ref}
      >
        <section className="px-4 pt-5 pb-4 sm:p-6">
          <form onSubmit={handleSubmit}>
            <Heading variant="h2" className="mb-2">
              Switch template
            </Heading>
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
            <div className="pt-4 bg-transparent mt-4 border-t">
              <ButtonGroup className="" isReverse>
                <Button type="submit">Update</Button>
                <Button onClick={() => setIsOpen(false)} accentColor="plain">
                  Cancel
                </Button>
              </ButtonGroup>
            </div>
          </form>
        </section>
      </dialog>
    </>
  );
};
