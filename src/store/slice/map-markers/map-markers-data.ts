/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import type { StatusType } from '#root/types';
import { NameSpace, Status } from '#root/const';
import type { MapMarkersType } from '#root/types/azs-map';
import { fetchMapMarkers } from './thunk';

type InitialStateType = {
  data: MapMarkersType | undefined;
  status: StatusType;
};

const initialState: InitialStateType = {
  data: undefined,
  status: Status.Idle,
};

const mapMarkersSlice = createSlice({
  name: NameSpace.MapMarkers,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMapMarkers.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchMapMarkers.fulfilled, (state, action) => {
        state.status = Status.Success;
        state.data = action.payload;
      })
      .addCase(fetchMapMarkers.rejected, (state) => {
        state.status = Status.Error;
      });
  },
});

export { mapMarkersSlice };
