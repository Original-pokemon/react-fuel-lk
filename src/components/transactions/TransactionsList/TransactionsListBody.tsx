import { Grid2, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';
import FuelChip from '#root/components/FuelChip/FuelChip';
import { TransactionType } from '#root/types';
import { formatNumberWithSpaces } from '#root/utils/format-number';

type TransactionBodyProperties = {
  transaction: TransactionType;
};

function TransactionBody({
  transaction,
}: TransactionBodyProperties): React.ReactElement {
  const { volume, fuelid, op, summa } = transaction;
  const transactionColor = op === -1 ? red[500] : green[500];
  const transactionType = op === -1 ? 'Списание' : 'Пополнение';

  return (
    <Grid2
      container
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
      minWidth="fit-content"
    >
      {/* Топливо */}
      <Grid2>
        <FuelChip fuelId={fuelid} />
      </Grid2>

      {/* Объем */}
      <Grid2>
        <Typography variant="caption" color="text.default">
          Объем:
        </Typography>
        <Typography variant="body2">{volume} л</Typography>
      </Grid2>

      <Grid2>
        <Typography variant="caption" color="text.default">
          {transactionType}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: transactionColor }}>
          {formatNumberWithSpaces(Number(summa.toFixed(2)))} ₽
        </Typography>
      </Grid2>
    </Grid2>
  );
}

export default TransactionBody;
