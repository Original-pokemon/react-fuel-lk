import { createAsyncThunk } from '@reduxjs/toolkit';
import APIRoute from '#root/store/api-route';
import type { AsyncThunkConfig, TransactionType } from '#root/types';
import NameSpace from '#root/store/const';

type FetchTransactionsParametersType = {
  firmid: number;
  cardnum: number;
  day: string;
  fromday: string;
};

const COUNT = 1_000_000;

const fetchTransactions = createAsyncThunk<
  TransactionType[],
  FetchTransactionsParametersType,
  AsyncThunkConfig
  >(
    `${NameSpace.Transaction}fetchTransactions`,
    async (parameters, { extra: api }) => {
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
  },
);

export default fetchTransactions;
