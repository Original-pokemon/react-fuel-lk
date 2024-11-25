import { createSelector } from '@reduxjs/toolkit';
import { NameSpace, Status } from '#root/const';
import type { InitialStateType } from '../../reducer';

type AppStateType = Pick<InitialStateType, typeof NameSpace.App>;

export const getAppStatus = createSelector(
  (state: AppStateType) => state[NameSpace.App].status,
  (status) => ({
    status,
    isIdle: status === Status.Idle,
    isLoading: status === Status.Loading,
    isError: status === Status.Error,
    isSuccess: status === Status.Success,
  }),
);
export const getNomenclatureInfo = (state: AppStateType) =>
  state[NameSpace.App].nomenclature;
