import { combineReducers } from '@reduxjs/toolkit';
import { NameSpace } from '#root/const';
import {
  authDataSlice,
  firmDataSlice,
  appDataSlice,
  transactionDataSlice,
  apiResponseDataSlice,
} from './slice';

const reducer = combineReducers({
  [NameSpace.Auth]: authDataSlice.reducer,
  [NameSpace.Firm]: firmDataSlice.reducer,
  [NameSpace.App]: appDataSlice.reducer,
  [NameSpace.Transaction]: transactionDataSlice.reducer,
  [NameSpace.ApiResponse]: apiResponseDataSlice.reducer,
});

export type InitialStateType = ReturnType<typeof reducer>;

export { reducer };
