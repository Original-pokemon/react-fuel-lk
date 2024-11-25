import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIRoute } from '#root/store/api-route';
import type { AsyncThunkConfig, TransactionType } from '#root/types';

type FetchTransactionsParametersType = {
  firmid: number;
  cardnum: number;
  day: string;
  fromday: string;
};

const COUNT = 1_000_000;

export const fetchTransactions = createAsyncThunk<
  TransactionType[],
  FetchTransactionsParametersType,
  AsyncThunkConfig
>('transactions/fetchTransactions', async (parameters, { extra: api }) => {
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
  return data;
});
