import { combineReducers } from '@reduxjs/toolkit';
import { NameSpace } from '#root/const';
import {
  authDataSlice,
  firmDataSlice,
  appDataSlice,
  transactionDataSlice,
} from './slice';

const reducer = combineReducers({
  [NameSpace.Auth]: authDataSlice.reducer,
  [NameSpace.Firm]: firmDataSlice.reducer,
  [NameSpace.App]: appDataSlice.reducer,
  [NameSpace.Transaction]: transactionDataSlice.reducer,
});

export type InitialStateType = ReturnType<typeof reducer>;

export { reducer };
