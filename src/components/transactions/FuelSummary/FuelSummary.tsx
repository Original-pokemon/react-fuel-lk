import { useMemo } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { useAppSelector } from '#root/hooks/state';
import { getAllTransactions, getNomenclatureInfo } from '#root/store';

type FuelData = {
  fuelId: number;
  fuelName: string;
  totalVolume: number;
  totalSumma: number;
  averagePrice: number;
};

function FuelSummary() {
  const transactions = useAppSelector(getAllTransactions);
  const nomenclature = useAppSelector(getNomenclatureInfo);

  const fuelData = useMemo(() => {
    const data: { [key: number]: FuelData } = {};

    transactions.forEach((transaction) => {
      const fuelId = transaction.fuelid;
      const fuelName =
        nomenclature?.find((n) => n.fuelid === fuelId)?.fuelname ||
        'Неизвестно';

      if (!data[fuelId]) {
        data[fuelId] = {
          fuelId,
          fuelName,
          totalVolume: 0,
          totalSumma: 0,
          averagePrice: 0,
        };
      }

      data[fuelId].totalVolume += transaction.volume;
      data[fuelId].totalSumma += transaction.summa;
    });

    // Вычисляем среднюю цену
    Object.values(data).forEach((item) => {
      item.averagePrice = item.totalSumma / item.totalVolume || 0;
    });

    return Object.values(data);
  }, [transactions, nomenclature]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Вид топлива</TableCell>
          <TableCell align="right">Объем (л)</TableCell>
          <TableCell align="right">Сумма (₽)</TableCell>
          <TableCell align="right">Средняя цена (₽/л)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {fuelData.map((fuel) => (
          <TableRow key={fuel.fuelId}>
            <TableCell>{fuel.fuelName}</TableCell>
            <TableCell align="right">{fuel.totalVolume.toFixed(2)}</TableCell>
            <TableCell align="right">
              ₽ {fuel.totalSumma.toLocaleString()}
            </TableCell>
            <TableCell align="right">
              ₽ {fuel.averagePrice.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default FuelSummary;
