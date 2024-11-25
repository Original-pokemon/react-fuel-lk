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

type CardData = {
  cardnum: number; // Номер карты
  totalVolume: number; // Общий объем
  totalSumma: number; // Общая сумма
  transactionCount: number; // Количество транзакций
};

function CardUsageSummary() {
  const transactions = useAppSelector(getAllTransactions);

  const cardData = useMemo(() => {
    const data: { [key: number]: CardData } = {};

    transactions.forEach((transaction) => {
      const { cardnum, volume, summa } = transaction;

      if (!data[cardnum]) {
        data[cardnum] = {
          cardnum,
          totalVolume: 0,
          totalSumma: 0,
          transactionCount: 0,
        };
      }

      data[cardnum].totalVolume += volume;
      data[cardnum].totalSumma += summa;
      data[cardnum].transactionCount += 1;
    });

    return Object.values(data).sort((a, b) => b.totalSumma - a.totalSumma);
  }, [transactions]);

  // Сделать компонент который поможет самому выбирать поля для оплучения среза по ним
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Номер карты</TableCell>
          <TableCell align="right">Количество транзакций</TableCell>
          <TableCell align="right">Объем (л)</TableCell>
          <TableCell align="right">Сумма (₽)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {cardData.map((card) => (
          <TableRow key={card.cardnum}>
            <TableCell>{card.cardnum}</TableCell>
            <TableCell align="right">{card.transactionCount}</TableCell>
            <TableCell align="right">{card.totalVolume.toFixed(2)}</TableCell>
            <TableCell align="right">
              ₽ {card.totalSumma.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default CardUsageSummary;
