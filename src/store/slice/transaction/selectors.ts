import { createSelector } from '@reduxjs/toolkit';
import { NameSpace, Status } from '#root/const';
import type { InitialStateType } from '#root/store/reducer';
import { transactionsAdapter } from './transaction-data';

type TransactionStateType = Pick<
  InitialStateType,
  typeof NameSpace.Transaction
>;

export const getTransactionStatus = createSelector(
  (state: TransactionStateType) => state[NameSpace.Transaction].status,
  (status) => ({
    status,
    isIdle: status === Status.Idle,
    isLoading: status === Status.Loading,
    isError: status === Status.Error,
    isSuccess: status === Status.Success,
  }),
);

export const { selectAll: getAllTransactions, selectById: getTransactionById } =
  transactionsAdapter.getSelectors<TransactionStateType>(
    (state) => state[NameSpace.Transaction],
  );
