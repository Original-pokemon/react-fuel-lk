import { create } from 'zustand';
import { AxiosInstance } from 'axios';
import type { StatusType, TransactionType } from '#root/types';
import { Status } from '#root/const';
import { APIRoute } from './api-route';

type FetchTransactionsParametersType = {
  firmid: number;
  cardnum: number;
  day: string;
  fromday: string;
};

const COUNT = 1_000_000;

interface TransactionState {
  status: StatusType;
  transactions: Map<string, TransactionType>;
  fetchTransactions: (
    parameters: FetchTransactionsParametersType,
    api: AxiosInstance,
  ) => Promise<void>;
  getAllTransactions: () => TransactionType[];
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  status: Status.Idle,
  transactions: new Map(),

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

      const transactionsMap = new Map<string, TransactionType>();
      data.forEach((transaction) => {
        const id = `${transaction.dt}-${transaction.cardnum}`;
        transactionsMap.set(id, transaction);
      });

      set({
        status: Status.Success,
        transactions: transactionsMap,
      });
    } catch {
      set({ status: Status.Error });
    }
  },

  getAllTransactions: () => {
    return Array.from(get().transactions.values()).sort(
      (a, b) => new Date(b.dt).getTime() - new Date(a.dt).getTime(),
    );
  },
}));
