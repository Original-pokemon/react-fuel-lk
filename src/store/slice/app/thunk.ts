import type { NomenclatureType } from '#root/types/nomenclature';
import type { AsyncThunkConfig } from '#root/types/thunk-config';
import { createAsyncThunk } from '@reduxjs/toolkit';
import NameSpace from '#root/store/const';
import APIRoute from '../../api-route';

const fetchNomenclatureData = createAsyncThunk<
  NomenclatureType[],
  undefined,
  AsyncThunkConfig
>(`${NameSpace.App}/getNomenclatureData`, async (_argument, { extra: api }) => {
  const { data } = await api.get<NomenclatureType[]>(APIRoute.NomenclatureData);

  return data;
});

export default fetchNomenclatureData;
