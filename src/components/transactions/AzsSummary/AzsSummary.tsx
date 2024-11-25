import { useMemo } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { useAppSelector } from '#root/hooks/state';
import { getAllTransactions } from '#root/store';

type AzsData = {
  azs: number;
  totalVolume: number;
  totalSumma: number;
  transactionCount: number;
};

function AzsSummary() {
  const transactions = useAppSelector(getAllTransactions);

  const azsData = useMemo(() => {
    const data: { [key: number]: AzsData } = {};

    transactions.forEach((transaction) => {
      const { azs, volume, summa } = transaction;

      if (!data[azs]) {
        data[azs] = {
          azs,
          totalVolume: 0,
          totalSumma: 0,
          transactionCount: 0,
        };
      }

      data[azs].totalVolume += volume;
      data[azs].totalSumma += summa;
      data[azs].transactionCount += 1;
    });

    return Object.values(data).sort((a, b) => b.totalSumma - a.totalSumma);
  }, [transactions]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>АЗС</TableCell>
          <TableCell align="right">Количество транзакций</TableCell>
          <TableCell align="right">Объем (л)</TableCell>
          <TableCell align="right">Сумма (₽)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {azsData.map((azs) => (
          <TableRow key={azs.azs}>
            s<TableCell>{azs.azs}</TableCell>
            <TableCell align="right">{azs.transactionCount}</TableCell>
            <TableCell align="right">{azs.totalVolume.toFixed(2)}</TableCell>
            <TableCell align="right">
              ₽ {azs.totalSumma.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default AzsSummary;
