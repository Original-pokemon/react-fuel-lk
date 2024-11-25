/* eslint-disable no-param-reassign */
import type { StatusType } from '#root/types';
import type { NomenclatureType } from '#root/types/nomenclature';
import { createSlice } from '@reduxjs/toolkit';
import { NameSpace, Status } from '#root/const';
import { fetchNomenclatureData } from './thunk';

type InitialStateType = {
  status: StatusType;
  nomenclature?: NomenclatureType[];
};

const initialState: InitialStateType = {
  status: Status.Idle,
  nomenclature: undefined,
};

export const appDataSlice = createSlice({
  name: NameSpace.Auth,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNomenclatureData.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchNomenclatureData.fulfilled, (state, action) => {
        state.status = Status.Success;
        state.nomenclature = action.payload;
      })
      .addCase(fetchNomenclatureData.rejected, (state) => {
        state.status = Status.Error;
      });
  },
});
