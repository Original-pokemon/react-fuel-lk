import type { FirmInfoType, AsyncThunkConfig } from '#root/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { NameSpace } from '#root/const';
import { APIRoute } from '../../api-route';
import { getFirmId } from '../auth-data/selectors';

export const fetchFirmData = createAsyncThunk<
  FirmInfoType,
  undefined,
  AsyncThunkConfig
>(
  `${NameSpace.Firm}/getFirmData`,
  async (_argument, { extra: api, getState }) => {
    const firmId = getFirmId(getState());

    if (!firmId) {
      throw new Error('Firm id not found');
    }

    const { data } = await api.get<FirmInfoType[]>(APIRoute.FirmInfo(firmId));

    return data[0];
  },
);
