import { create } from 'zustand';
import axios from 'axios';
import type { StatusType } from '#root/types';
import { Status } from '#root/const';
import type { MapMarkersType } from '#root/types/azs-map';
import { APIRoute } from './api-route';

interface MapMarkersState {
  data: MapMarkersType | undefined;
  status: StatusType;
  fetchMapMarkers: () => Promise<void>;
}

export const useMapMarkersStore = create<MapMarkersState>((set) => ({
  data: undefined,
  status: Status.Idle,

  fetchMapMarkers: async () => {
    set({ status: Status.Loading });
    try {
      const { data } = await axios.get<MapMarkersType>(APIRoute.MapMarkers, {
        timeout: 5000,
      });

      set({
        status: Status.Success,
        data,
      });
    } catch {
      set({ status: Status.Error });
    }
  },
}));
