import { create } from 'zustand';
import { AxiosInstance } from 'axios';
import type { CardType, FirmInfoType, StatusType } from '#root/types';
import { Status } from '#root/const';
import { APIRoute } from './api-route';

interface FirmState {
  status: StatusType;
  firmInfo?: Omit<FirmInfoType, 'cards'>;
  cards: Map<number, CardType>;
  fetchFirmData: (firmId: number, api: AxiosInstance) => Promise<void>;
  getCardById: (id: number) => CardType | undefined;
  getAllCards: () => CardType[];
}

export const useFirmStore = create<FirmState>((set, get) => ({
  status: Status.Idle,
  firmInfo: undefined,
  cards: new Map(),

  fetchFirmData: async (firmId, api) => {
    set({ status: Status.Loading });
    try {
      const { data } = await api.get<FirmInfoType[]>(APIRoute.FirmInfo(firmId));
      const firmData = data[0];
      const { cards, ...firmInfo } = firmData;

      const cardsMap = new Map<number, CardType>();
      cards.forEach((card) => {
        cardsMap.set(card.cardnum, card);
      });

      set({
        status: Status.Success,
        firmInfo,
        cards: cardsMap,
      });
    } catch {
      set({ status: Status.Error });
    }
  },

  getCardById: (id) => {
    return get().cards.get(id);
  },

  getAllCards: () => {
    return Array.from(get().cards.values()).sort(
      (a, b) => a.cardnum - b.cardnum,
    );
  },
}));
