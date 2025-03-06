'use client';

import { FC, useRef } from 'react';
import { Provider } from 'react-redux';

import { AppStore, createStore } from '@/store';
import { ChildrenProp } from 'src/types/children-prop';

export const StoreProvider: FC<ChildrenProp> = ({ children }) => {
  const storeRef = useRef<AppStore>(undefined);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = createStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};
