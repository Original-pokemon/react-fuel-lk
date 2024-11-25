import type { NomenclatureType } from '#root/types/nomenclature';
import type { AsyncThunkConfig } from '#root/types/thunk-config';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { NameSpace } from '#root/const';
import { APIRoute } from '../../api-route';

export const fetchNomenclatureData = createAsyncThunk<
  NomenclatureType[],
  undefined,
  AsyncThunkConfig
>(`${NameSpace.App}/getNomenclatureData`, async (_argument, { extra: api }) => {
  const { data } = await api.get<NomenclatureType[]>(APIRoute.NomenclatureData);

  // const data = await generateMockFirmData(1000);

  return data;
});
