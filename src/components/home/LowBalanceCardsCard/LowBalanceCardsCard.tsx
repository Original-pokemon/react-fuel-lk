import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AppRoute from '#root/const/app-route';
import { formatNumberWithSpaces } from '#root/utils/format-number';
import CardAvatar from '#root/components/CardAvatar/CardAvatar';
import FuelChip from '#root/components/FuelChip/FuelChip';
import { LowBalanceCard } from '#root/pages/Home/getLowBalanceCards';
import DashboardCard from '../DashboardCard/DashboardCard';

const FILTER_BY_CARD_NUMBER_NAME = 'filterByCardNumber';

type LowBalanceCardsCardProps = {
  cards: LowBalanceCard[];
};

function LowBalanceCardsCard({ cards }: LowBalanceCardsCardProps) {
  const navigate = useNavigate();

  return (
    <DashboardCard title="Карты с низким балансом">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {cards.length > 0 ? (
          cards.map((card) => (
            <Box
              key={card.cardNumber}
              onClick={() =>
                navigate(`${AppRoute.Cards}?${FILTER_BY_CARD_NUMBER_NAME}=${card.cardNumber}`)
              }
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'action.hover' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CardAvatar cardnum={card.cardNumber} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {card.walletType === 2 ? (
                  <Typography variant="body2">
                    {formatNumberWithSpaces(Number(card.totalBalance))} л
                  </Typography>
                ) : (
                  card.fuelBalances.map((fuel) => (
                    <Box key={fuel.fuelId} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FuelChip fuelId={fuel.fuelId} />
                      <Typography variant="body2">
                        {formatNumberWithSpaces(Number(fuel.volume))} л
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            Нет карт с низким балансом
          </Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(AppRoute.Cards)}
            sx={{ px: 2, py: 0.5, borderRadius: 2 }}
          >
            Все карты
          </Button>
        </Box>
      </Box>
    </DashboardCard>
  );
}

export default LowBalanceCardsCard;
