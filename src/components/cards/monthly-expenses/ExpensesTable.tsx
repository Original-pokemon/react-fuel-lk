import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { formatNumberWithSpaces } from '#root/utils/format-number';
import FuelChip from '#root/components/FuelChip/FuelChip';

type FuelExpense = {
  fuelId: number;
  volume: number;
  amount: number;
};

type CardExpense = {
  cardNumber: number;
  fuelExpenses: FuelExpense[];
  totalVolume: number;
  totalAmount: number;
};

type ExpensesTableProperties = {
  cards: CardExpense[];
};

function ExpensesTable({ cards }: ExpensesTableProperties) {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.25' }}>
            <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>
              Карта
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>
              Вид топлива
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 'bold',
                width: '25%',
                textAlign: 'right',
              }}
            >
              Объем (л)
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 'bold',
                width: '25%',
                textAlign: 'right',
              }}
            >
              Сумма (₽)
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cards.map((card) => (
            <>
              {/* Заголовок карты */}
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell
                  colSpan={4}
                  sx={{ fontWeight: 'bold', fontSize: '1.1em' }}
                >
                  Карта {card.cardNumber}
                </TableCell>
              </TableRow>

              {/* Детали по видам топлива */}
              {card.fuelExpenses.map((fuel, index) => (
                <TableRow
                  key={`${card.cardNumber}-${fuel.fuelId}`}
                  sx={{
                    bgcolor: index % 2 === 0 ? 'transparent' : 'grey.25',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <TableCell />
                  <TableCell>
                    <FuelChip fuelId={fuel.fuelId} />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    {formatNumberWithSpaces(fuel.volume)}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    {formatNumberWithSpaces(fuel.amount)}
                  </TableCell>
                </TableRow>
              ))}

              {/* Итог по карте */}
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell />
                <TableCell sx={{ fontWeight: 'bold' }}>
                  Итого по карте
                </TableCell>
                <TableCell sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                  {formatNumberWithSpaces(card.totalVolume)}
                </TableCell>
                <TableCell sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                  {formatNumberWithSpaces(card.totalAmount)}
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ExpensesTable;
