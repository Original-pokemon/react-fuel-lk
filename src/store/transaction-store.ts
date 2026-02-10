import { create } from "zustand";
import { AxiosInstance } from "axios";
import type { StatusType, TransactionType } from "#root/types";
import { Status } from "#root/const";
import { APIRoute } from "./api-route";

type FetchTransactionsParametersType = {
  firmid: number;
  cardnum: number;
  day: string;
  fromday: string;
};

const COUNT = 1_000_000;

interface TransactionState {
  status: StatusType;
  transactions: TransactionType[];
  fetchTransactions: (
    parameters: FetchTransactionsParametersType,
    api: AxiosInstance,
  ) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  status: Status.Idle,
  transactions: [],

  fetchTransactions: async (parameters, api) => {
    set({ status: Status.Loading });
    try {
      const { firmid, cardnum, day, fromday } = parameters;

      const { data } = await api.get<TransactionType[]>(APIRoute.Transaction, {
        params: {
          firmid,
          cardnum,
          day,
          fromday,
          count: COUNT,
        },
      });

      const sorted = [...data].sort(
        (a, b) => new Date(b.dt).getTime() - new Date(a.dt).getTime(),
      );

      set({
        status: Status.Success,
        transactions: sorted,
      });
    } catch {
      set({ status: Status.Error });
    }
  },
}));
