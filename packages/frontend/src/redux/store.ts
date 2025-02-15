import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { emptyFinancerApi } from '$api/emptyFinancerApi';
import { appReducer, appSlicePath } from '$reducer/app.reducer';
import {
  notificationReducer,
  notificationSlicePath,
} from '$reducer/notifications.reducer';

import '$api/config/apiConfig';

export const createStore = () =>
  configureStore({
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

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore['getState']>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
