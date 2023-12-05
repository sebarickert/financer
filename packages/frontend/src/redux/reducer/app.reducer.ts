import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  isHeaderActionActive: boolean;
}

const initialState: AppState = {
  isHeaderActionActive: false,
};

export const appSlicePath = 'app';

const appSlice = createSlice({
  name: appSlicePath,
  initialState,
  reducers: {
    setHeaderActionState(state, { payload }: PayloadAction<boolean>) {
      return { ...state, isHeaderActionActive: payload };
    },
  },
});

export const { setHeaderActionState } = appSlice.actions;

export const { reducer: appReducer } = appSlice;
