import { createSelector } from '@reduxjs/toolkit';
import { NameSpace, Status } from '#root/const';
import type { FirmCashType, FirmInfoType } from '#root/types';
import type { InitialStateType } from '../../reducer';
import { cardsAdapter } from './firm-data';

type FirmStateType = Pick<InitialStateType, typeof NameSpace.Firm>;

export const getFirmStatus = createSelector(
  (state: FirmStateType) => state[NameSpace.Firm].status,
  (status) => ({
    status,
    isIdle: status === Status.Idle,
    isLoading: status === Status.Loading,
    isError: status === Status.Error,
    isSuccess: status === Status.Success,
  }),
);
export const getFirmInfo = (
  state: FirmStateType,
): Omit<FirmInfoType, 'cards'> | undefined => state[NameSpace.Firm].firmInfo;
export const getFirmName = (state: FirmStateType): string | undefined =>
  state[NameSpace.Firm].firmInfo?.firmname;
export const getFirmCash = (state: FirmStateType): FirmCashType | undefined =>
  state[NameSpace.Firm].firmInfo?.firmcash;
export const getFirmWallet = (
  state: FirmStateType,
): FirmInfoType['firmwallet'] | undefined =>
  state[NameSpace.Firm].firmInfo?.firmwallet;

export const {
  selectById: getFirmCardById,
  selectAll: getFirmCards,
  selectEntities: getFirmCardsEntities,
} = cardsAdapter.getSelectors<FirmStateType>(
  (state) => state[NameSpace.Firm].cards,
);
