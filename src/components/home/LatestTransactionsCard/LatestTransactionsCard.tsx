import { Box, Typography, Button } from '@mui/material';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import AppRoute from '#root/const/app-route';
import { formatNumberWithSpaces } from '#root/utils/format-number';
import CardAvatar from '#root/components/CardAvatar/CardAvatar';
import FuelChip from '#root/components/FuelChip/FuelChip';
import Spinner from '#root/components/Spinner/Spinner';
import { TransactionType } from '#root/types/card-transaction';
import DashboardCard from '../DashboardCard/DashboardCard';

type LatestTransactionsCardProps = {
  transactions: TransactionType[];
  isLoading: boolean;
};

function LatestTransactionsCard({ transactions, isLoading }: LatestTransactionsCardProps) {
  const navigate = useNavigate();

  return (
    <DashboardCard title="Последние транзакции">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {isLoading ? (
          <Spinner />
        ) : transactions.length > 0 ? (
          transactions.map((transaction) => (
            <Box
              key={`${transaction.dt}-${transaction.cardnum}-${transaction.op}`}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CardAvatar cardnum={transaction.cardnum} />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body2">АЗС-{transaction.azs}</Typography>
                  <Typography variant="caption" color="text.default">
                    {dayjs(transaction.dt).format('DD.MM.YYYY HH:mm:ss')}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minWidth: 'fit-content',
                }}
              >
                <Box>
                  <FuelChip fuelId={transaction.fuelid} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.default">
                    Объем:
                  </Typography>
                  <Typography variant="body2">
                    {formatNumberWithSpaces(Number(transaction.volume))} л
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.default">
                    {transaction.op === -1 ? 'Списание' : 'Пополнение'}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: transaction.op === -1 ? 'red' : 'green' }}
                  >
                    {formatNumberWithSpaces(Number(transaction.summa.toFixed(2)))} ₽
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            Нет транзакций
          </Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(AppRoute.Transaction)}
            sx={{ px: 2, py: 0.5, borderRadius: 2 }}
          >
            Все транзакции
          </Button>
        </Box>
      </Box>
    </DashboardCard>
  );
}

export default LatestTransactionsCard;
