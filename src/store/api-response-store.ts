import { create } from 'zustand';
import { AxiosInstance } from 'axios';
import type {
  StatusType,
  ApiResponseType,
  FirmDataType,
  CardInfoType,
} from '#root/types';
import { Status } from '#root/const';
import { APIRoute } from './api-route';
import { adaptApiResponse } from '../utils/api-adapter';

interface ApiResponseState {
  status: StatusType;
  fuelnames?: ApiResponseType['fuelNames'];
  pricetypes?: ApiResponseType['priceTypes'];
  firm?: FirmDataType;
  data?: ApiResponseType;
  cards: Map<number, CardInfoType>;
  fetchApiResponseData: (firmId: number, api: AxiosInstance) => Promise<void>;
  getCardById: (id: number) => CardInfoType | undefined;
  getAllCards: () => CardInfoType[];
}

export const useApiResponseStore = create<ApiResponseState>((set, get) => ({
  status: Status.Idle,
  data: undefined,
  fuelnames: undefined,
  firm: undefined,
  pricetypes: undefined,
  cards: new Map(),

  fetchApiResponseData: async (firmId, api) => {
    set({ status: Status.Loading });
    try {
      const { data } = await api.get<ApiResponseType>(APIRoute.FullData);
      const adaptedData = adaptApiResponse(data);

      const {
        firms,
        blocked,
        noRemains,
        remains,
        workingCards,
        ...essentialData
      } = adaptedData;

      const firmData = firms.find((f: FirmDataType) => f.firmId === firmId);
      const cardsMap = new Map<number, CardInfoType>();

      if (firmData) {
        Object.values(firmData.cards || {}).forEach((card) => {
          cardsMap.set(card.cardNumber, card);
        });
      }

      set({
        status: Status.Success,
        data: essentialData as ApiResponseType,
        fuelnames: adaptedData.fuelNames,
        pricetypes: adaptedData.priceTypes,
        firm: firmData,
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
      (a, b) => a.cardNumber - b.cardNumber,
    );
  },
}));
