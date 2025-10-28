import { createSelector } from '@reduxjs/toolkit';
import { NameSpace, Status } from '#root/const';
import type { InitialStateType } from '#root/store/reducer';

type MapMarkersStateType = Pick<InitialStateType, typeof NameSpace.MapMarkers>;

export const getMapMarkersStatus = createSelector(
  (state: MapMarkersStateType) => state[NameSpace.MapMarkers].status,
  (status) => ({
    status,
    isIdle: status === Status.Idle,
    isLoading: status === Status.Loading,
    isError: status === Status.Error,
    isSuccess: status === Status.Success,
  }),
);

export const getMapMarkers = createSelector(
  (state: MapMarkersStateType) => state[NameSpace.MapMarkers].data,
  (data) => data,
);
