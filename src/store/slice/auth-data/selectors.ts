import { createSelector } from '@reduxjs/toolkit';
import { NameSpace, Status } from '#root/const';
import type { AuthInfoType } from '#root/types';
import type { InitialStateType } from '../../reducer';

type AuthStateType = Pick<InitialStateType, typeof NameSpace.Auth>;

export const getAuthStatus = createSelector(
  (state: AuthStateType) => state[NameSpace.Auth].status,
  (status) => ({
    status,
    isIdle: status === Status.Idle,
    isLoading: status === Status.Loading,
    isError: status === Status.Error,
    isSuccess: status === Status.Success,
  }),
);
export const getAuthData = (state: AuthStateType): AuthInfoType | undefined =>
  state[NameSpace.Auth].authData;
export const getFirmId = (state: AuthStateType): number | undefined =>
  state[NameSpace.Auth].authData?.firmId;
export const isAdmin = (state: AuthStateType): boolean | undefined =>
  state[NameSpace.Auth].authData?.isAdmin;
export const isCard = (state: AuthStateType): boolean | undefined =>
  state[NameSpace.Auth].authData?.isCard;
export const getCardNumber = (state: AuthStateType): number | undefined =>
  state[NameSpace.Auth].authData?.cardNum;
