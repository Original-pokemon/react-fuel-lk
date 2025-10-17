import type { ApiResponseType, AsyncThunkConfig } from '#root/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { NameSpace } from '#root/const';
import { APIRoute } from '../../api-route';
import { adaptApiResponse } from '../../../utils/api-adapter';

export const fetchApiResponseData = createAsyncThunk<
  ApiResponseType,
  number,
  AsyncThunkConfig
>(
  `${NameSpace.ApiResponse}/getApiResponseData`,
  async (firmId, { extra: api }) => {
    const { data } = await api.get<ApiResponseType>(APIRoute.FullData);

    return adaptApiResponse(data);
  },
);
