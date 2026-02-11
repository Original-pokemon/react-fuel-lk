import { create } from 'zustand';
import { AxiosInstance } from 'axios';
import type { StatusType } from '#root/types';
import type { NomenclatureType } from '#root/types/nomenclature';
import { Status } from '#root/const';
import { APIRoute } from './api-route';

interface AppState {
  status: StatusType;
  nomenclature?: NomenclatureType[];
  fetchNomenclatureData: (api: AxiosInstance) => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  status: Status.Idle,
  nomenclature: undefined,

  fetchNomenclatureData: async (api) => {
    set({ status: Status.Loading });
    try {
      const { data } = await api.get<NomenclatureType[]>(
        APIRoute.NomenclatureData,
      );

      set({
        status: Status.Success,
        nomenclature: data,
      });
    } catch {
      set({ status: Status.Error });
    }
  },
}));
