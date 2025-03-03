import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { appReducer, appSlicePath } from '@/reducer/app.reducer';
import {
  notificationReducer,
  notificationSlicePath,
} from '@/reducer/notifications.reducer';

import '$api/config/apiConfig';

export const createStore = () =>
  configureStore({
    reducer: {
      [appSlicePath]: appReducer,
      [notificationSlicePath]: notificationReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: { warnAfter: 100 },
      }),
  });

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore['getState']>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
