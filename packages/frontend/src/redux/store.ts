import { configureStore } from '@reduxjs/toolkit';

import { emptyFinancerApi } from './api/emptyFinancerApi';

export const store = configureStore({
  reducer: {
    [emptyFinancerApi.reducerPath]: emptyFinancerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: { warnAfter: 100 },
    }).concat(emptyFinancerApi.middleware),
});
