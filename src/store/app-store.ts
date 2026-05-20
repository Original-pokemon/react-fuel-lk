import { create } from 'zustand';
import type { StatusType } from '#root/types';
import type { NomenclatureType } from '#root/types/nomenclature';
import { Status } from '#root/const';
import { api } from '#root/services/api/api';
import { APIRoute } from './api-route';

interface AppState {
  status: StatusType;
  nomenclature?: NomenclatureType[];
  fetchNomenclatureData: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  status: Status.Idle,
  nomenclature: undefined,

  fetchNomenclatureData: async () => {
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
