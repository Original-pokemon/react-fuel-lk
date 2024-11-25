/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import type { AuthInfoType, StatusType } from '#root/types';
import { NameSpace, Status } from '#root/const';
import { dropToken } from '#root/services/api/token';
import { postAuthData, fetchAuthInfo } from './thunk';

type InitialStateType = {
  status: StatusType;
  authData?: AuthInfoType;
};

const initialState: InitialStateType = {
  status: Status.Idle,
  authData: undefined,
};

const authDataSlice = createSlice({
  name: NameSpace.Auth,
  initialState,
  reducers: {
    logout(state) {
      dropToken();

      state.authData = undefined;
      state.status = Status.Idle;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postAuthData.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(postAuthData.fulfilled, (state, action) => {
        state.status = Status.Success;
        state.authData = action.payload;
      })
      .addCase(postAuthData.rejected, (state) => {
        state.status = Status.Error;
      })
      .addCase(fetchAuthInfo.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchAuthInfo.fulfilled, (state, action) => {
        state.status = Status.Success;
        state.authData = action.payload;
      })
      .addCase(fetchAuthInfo.rejected, (state) => {
        state.status = Status.Error;
      });
  },
});

export const { logout } = authDataSlice.actions;

export { authDataSlice };
