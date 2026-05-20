import { create } from "zustand";
import { AxiosInstance } from "axios";
import type {
  StatusType,
  ApiResponseType,
  FirmDataType,
  CardInfoType,
} from "#root/types";
import { Status } from "#root/const";
import { APIRoute } from "./api-route";
import { adaptApiResponse } from "../utils/api-adapter";

interface ApiResponseState {
  status: StatusType;
  fuelnames?: ApiResponseType["fuelNames"];
  pricetypes?: ApiResponseType["priceTypes"];
  firm?: FirmDataType;
  data?: ApiResponseType;
  cards: CardInfoType[];
  fetchApiResponseData: (firmId: number, api: AxiosInstance) => Promise<void>;
}

export const useApiResponseStore = create<ApiResponseState>((set) => ({
  status: Status.Idle,
  data: undefined,
  fuelnames: undefined,
  firm: undefined,
  pricetypes: undefined,
  cards: [],

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

      const firmData = firms?.find((f: FirmDataType) => f.firmId === firmId);

      if (!firmData) {
        set({ status: Status.Empty, firm: undefined, cards: [] });
        return;
      }

      const cardsList = Object.values(firmData.cards || {}).sort(
        (a, b) => a.cardNumber - b.cardNumber,
      );

      set({
        status: Status.Success,
        data: essentialData as ApiResponseType,
        fuelnames: adaptedData.fuelNames,
        pricetypes: adaptedData.priceTypes,
        firm: firmData,
        cards: cardsList,
      });
    } catch {
      set({ status: Status.Error });
    }
  },
}));
