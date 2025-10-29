import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIRoute } from '#root/store/api-route';
import type { AsyncThunkConfig } from '#root/types';
import type { MapMarkersType } from '#root/types/azs-map';
import axios from 'axios';

export const fetchMapMarkers = createAsyncThunk<
  MapMarkersType,
  void,
  AsyncThunkConfig
>('mapMarkers/fetchMapMarkers', async () => {
  const { data } = await axios.get<MapMarkersType>(APIRoute.MapMarkers, {
    timeout: 5000,
  });
  return data;
});
