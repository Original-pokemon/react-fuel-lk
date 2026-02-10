import { Paper, Typography, Box } from '@mui/material';
import { formatNumberWithSpaces } from '#root/utils/format-number';

type OverallTotalsProperties = {
  totalVolume: number;
  totalAmount: number;
};

function OverallTotals({ totalVolume, totalAmount }: OverallTotalsProperties) {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Общие итоги
      </Typography>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Typography variant="body1">
          Общий объем: {formatNumberWithSpaces(totalVolume)} л
        </Typography>
        <Typography variant="body1">
          Общая сумма: {formatNumberWithSpaces(totalAmount)} ₽
        </Typography>
      </Box>
    </Paper>
  );
}

export default OverallTotals;
