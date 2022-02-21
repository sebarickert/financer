import { useEffect, useState } from 'react';
import { isConstructorDeclaration } from 'typescript';

import { getAllAccounts } from '../pages/accounts/AccountService';

export const useAllAccounts = (): IAccount[] | null => {
  const [accounts, setAccounts] = useState<IAccount[] | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      setAccounts(await getAllAccounts());
    };

    fetchAccounts();
  }, []);

  return accounts;
};

export const useAllAccountsByType = (
  types: IAccount['type'][]
): [IAccount[] | null, (types: IAccount['type'][]) => void] => {
  const allAccounts = useAllAccounts();
  const [targetAccounts, setTargetAccounts] = useState<IAccount[] | null>(null);
  const [targetTypes, setTargetTypes] = useState(types);

  useEffect(() => {
    if (!allAccounts) return;

    const newTargetAccounts = allAccounts.filter(({ type }) =>
      targetTypes.includes(type)
    );

    setTargetAccounts(newTargetAccounts);
  }, [allAccounts, targetTypes]);

  return [targetAccounts, setTargetTypes];
};
