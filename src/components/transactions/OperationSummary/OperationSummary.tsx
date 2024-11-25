import { useMemo } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { useAppSelector } from '#root/hooks/state';
import { getAllTransactions } from '#root/store';

function OperationSummary() {
  const transactions = useAppSelector(getAllTransactions);

  const { totalDebit, totalCredit, netBalance } = useMemo(() => {
    let totalDebitResult = 0;
    let totalCreditResult = 0;

    transactions.forEach((transaction) => {
      if (transaction.op === -1) {
        totalDebitResult += transaction.summa;
      } else if (transaction.op === 1) {
        totalCreditResult += transaction.summa;
      }
    });

    const netBalanceResult = totalCreditResult - totalDebitResult;

    return {
      totalDebit: totalDebitResult,
      totalCredit: totalCreditResult,
      netBalance: netBalanceResult,
    };
  }, [transactions]);

  return (
    <Grid container spacing={2} mb={2}>
      <Grid item xs={12} sm={4}>
        <Card variant="outlined">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Сумма списаний
            </Typography>
            <Typography variant="h5">
              ₽ {totalDebit.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card variant="outlined">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Сумма пополнений
            </Typography>
            <Typography variant="h5">
              ₽ {totalCredit.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card variant="outlined">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Чистый баланс
            </Typography>
            <Typography variant="h5">
              ₽ {netBalance.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default OperationSummary;
