import { create } from "zustand";
import type { CardType, FirmInfoType, StatusType } from "#root/types";
import { Status } from "#root/const";
import { api } from "#root/services/api/api";
import { APIRoute } from "./api-route";

interface FirmState {
  status: StatusType;
  firmInfo?: Omit<FirmInfoType, "cards">;
  cards: CardType[];
  fetchFirmData: (firmId: number) => Promise<void>;
}

export const useFirmStore = create<FirmState>((set) => ({
  status: Status.Idle,
  firmInfo: undefined,
  cards: [],

  fetchFirmData: async (firmId) => {
    set({ status: Status.Loading });
    try {
      const { data } = await api.get<FirmInfoType[]>(APIRoute.FirmInfo(firmId));
      const firmData = data[0];
      const { cards, ...firmInfo } = firmData;

      const sortedCards = [...cards].sort((a, b) => a.cardnum - b.cardnum);

      set({
        status: Status.Success,
        firmInfo,
        cards: sortedCards,
      });
    } catch {
      set({ status: Status.Error });
    }
  },
}));
