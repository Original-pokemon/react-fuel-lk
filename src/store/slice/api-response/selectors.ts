import { createSelector } from '@reduxjs/toolkit';
import { NameSpace, Status } from '#root/const';
import type { InitialStateType } from '../../reducer';
import { apiResponseCardsAdapter } from './api-response-data';

type ApiResponseStateType = Pick<
  InitialStateType,
  typeof NameSpace.ApiResponse
>;

export const getApiResponseStatus = createSelector(
  (state: ApiResponseStateType) => state[NameSpace.ApiResponse].status,
  (status) => ({
    status,
    isIdle: status === Status.Idle,
    isLoading: status === Status.Loading,
    isError: status === Status.Error,
    isSuccess: status === Status.Success,
  }),
);

export const getApiResponseData = createSelector(
  (state: ApiResponseStateType) => state[NameSpace.ApiResponse].data,
  (data) => data,
);

export const getApiResponseFirm = (state: ApiResponseStateType) =>
  state[NameSpace.ApiResponse].firm;

export const getApiResponseFirmContracts = createSelector(
  getApiResponseFirm,
  (firm) => firm?.contracts,
);
export const {
  selectById: getApiResponseFirmCardById,
  selectAll: getApiResponseFirmCards,
  selectEntities: getApiResponseFirmCardsEntities,
} = apiResponseCardsAdapter.getSelectors<ApiResponseStateType>(
  (state) => state[NameSpace.ApiResponse].cards,
);
