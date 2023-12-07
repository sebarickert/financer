import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { emptyFinancerApi } from '$api/emptyFinancerApi';
import { appSlicePath, appReducer } from '$reducer/app.reducer';
import {
  notificationSlicePath,
  notificationReducer,
} from '$reducer/notifications.reducer';

import '$api/config/apiConfig';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createStore = (initialValues?: any) =>
  configureStore({
    preloadedState: initialValues,
    reducer: {
      [emptyFinancerApi.reducerPath]: emptyFinancerApi.reducer,
      [appSlicePath]: appReducer,
      [notificationSlicePath]: notificationReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: { warnAfter: 100 },
      }).concat(emptyFinancerApi.middleware),
  });

export const store = createStore();

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore['getState']>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
