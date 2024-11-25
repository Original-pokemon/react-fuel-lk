import dayjs from 'dayjs';
import { TransactionType } from '#root/types';

export const mapTransactionsToRows = (transactions: TransactionType[]) => {
  return transactions.map((transaction) => {
    return {
      id: `${transaction.dt}-${transaction.cardnum}-${transaction.op}`,
      dt: dayjs(transaction.dt).format('DD.MM.YYYY HH:mm:ss'),
      cardnum: transaction.cardnum,
      summa: transaction.summa,
      volume: transaction.volume,
      fuelid: transaction.fuelid,
      azs: transaction.azs,
      price: transaction.price,
      confirmed: transaction.confirmed,
      op: transaction.op,
    };
  });
};
