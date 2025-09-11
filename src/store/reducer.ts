import { combineReducers } from '@reduxjs/toolkit';
import {
  authDataSlice,
  firmDataSlice,
  appDataSlice,
  transactionDataSlice,
} from './slice';
import NameSpace from './const';

const reducer = combineReducers({
  [NameSpace.Auth]: authDataSlice.reducer,
  [NameSpace.Firm]: firmDataSlice.reducer,
  [NameSpace.App]: appDataSlice.reducer,
  [NameSpace.Transaction]: transactionDataSlice.reducer,
});

export type InitialStateType = ReturnType<typeof reducer>;

export { reducer };
