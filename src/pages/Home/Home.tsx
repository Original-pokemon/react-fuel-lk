import { useEffect, Fragment, useState } from 'react';
import { Box, Grid2 as Grid, Typography, Button } from '@mui/material';
import dayjs from 'dayjs';

import { useAppDispatch, useAppSelector } from '#root/hooks/state';
import Spinner from '#root/components/Spinner/Spinner';
import {
  fetchFirmData,
  getApiResponseFirm,
  getApiResponseFirmCards,
  getApiResponseStatus,
  getNomenclatureInfo,
  fetchNomenclatureData,
  getAppStatus,
  fetchTransactions,
  getAllTransactions,
} from '#root/store';
import { formatNumberWithSpaces } from '#root/utils/format-number';
import DashboardCard from '#root/components/home/DashboardCard/DashboardCard';
// import DataListBox from '#root/components/home/DataListBox/DataListBox';
import KPIBox from '#root/components/home/KPIBox/KPIBox';
// import {
//   CardsInfoCard,
//   FuelBalanceCard,
//   ExpenseDynamicsChartCard, // Import the new component
// } from '#root/components/home/boxes/boxex';
import ContactsBox from '#root/components/boxes/ContactsBox/ContactsBox';
import CardAvatar from '#root/components/CardAvatar/CardAvatar';
import AppRoute from '#root/const/app-route';
import { useNavigate } from 'react-router-dom';
// import HomeStyledBox from './Home.style';
import FuelChip from '#root/components/FuelChip/FuelChip';
import ODINTSOVO_COORD from '../../const/map';
import { prepareMarkers } from '../../utils/markers';
import mapInfo from '../../mock/map-info';
import Map from '../../components/Map/Map';

const FILTER_BY_CARD_NUMBER_NAME = 'filterByCardNumber';

const mapConfig = {
  center: ODINTSOVO_COORD,
  keyboard: false,
  dragging: false,
  attributionControl: false,
  zoomConfig: {
    zoom: 9,
    scrollWheelZoom: false,
    zoomControl: false,
    doubleClickZoom: false,
    touchZoom: false,
    boxZoom: false,
  },
  style: { height: '100%' },
};
const markers = prepareMarkers(mapInfo);

function Home() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const firmInfo = useAppSelector(getApiResponseFirm);
  const cards = useAppSelector(getApiResponseFirmCards);
  const nomenclature = useAppSelector(getNomenclatureInfo);
  const transactions = useAppSelector(getAllTransactions);

  const apiResponseStatus = useAppSelector(getApiResponseStatus);
  const { isIdle } = useAppSelector(getAppStatus);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  const isLoaded = apiResponseStatus.isSuccess && firmInfo;

  const totalCards = cards.length;
  const activeCards = cards.filter((c) => !c.blocked).length;

  // Get up to 5 cards with low balance (minimum fuel volume less than 50 liters)
  const lowBalanceCards = cards
    .filter(
      (card) =>
        !card.blocked && card.walletType !== 2 && card.sost === 'выдана',
    )
    .map((card) => {
      const fuelBalances = Object.entries(card.wallets).map(
        ([fuelId, volume]) => ({
          fuelId: +fuelId,
          volume: +volume,
        }),
      );

      return {
        ...card,
        fuelBalances,
        totalBalance:
          fuelBalances.length > 0
            ? Math.min(...fuelBalances.map((f) => f.volume))
            : 0,
      };
    })
    .filter((card) => card.totalBalance < 50)
    .sort((a, b) => a.totalBalance - b.totalBalance) // Sort by lowest balance first
    .slice(0, 5);

  // Get up to 5 cards with walletType 1 and low monthRemain
  const lowMonthRemainCards = cards
    .filter(
      (card) =>
        !card.blocked &&
        card.walletType === 2 &&
        +card.monthRemain !== 9999.99 &&
        card.sost === 'выдана',
    )
    .map((card) => {
      const fuelBalances = [
        {
          fuelId: 0, // Use 0 as a placeholder since monthRemain is a single value
          volume: +card.monthRemain,
        },
      ];

      return {
        ...card,
        fuelBalances,
        totalBalance: +card.monthRemain,
      };
    })
    .filter((card) => card.totalBalance < 50)
    .sort((a, b) => a.totalBalance - b.totalBalance) // Sort by lowest balance first
    .slice(0, 5);

  // Combine both lists and remove duplicates, then sort by last usage date
  const combinedLowBalanceCards = [
    ...lowBalanceCards,
    ...lowMonthRemainCards.filter(
      (monthCard) =>
        !lowBalanceCards.some(
          (balanceCard) => balanceCard.cardNumber === monthCard.cardNumber,
        ),
    ),
  ]
    .map((card) => ({
      ...card,
      lastUsed: card.date ? new Date(card.date).getTime() : 0,
    }))
    .sort((a, b) => b.lastUsed - a.lastUsed) // Sort by oldest usage first (newest to oldest)
    .slice(0, 5);

  useEffect(() => {
    if (!firmInfo && apiResponseStatus.isIdle) {
      dispatch(fetchFirmData());
    }
  }, [dispatch, firmInfo, apiResponseStatus.isIdle]);

  useEffect(() => {
    if (!nomenclature && isIdle) {
      dispatch(fetchNomenclatureData());
    }
  }, [nomenclature, dispatch, isIdle]);

  useEffect(() => {
    if (firmInfo && transactions.length === 0) {
      setIsLoadingTransactions(true);
      dispatch(
        fetchTransactions({
          firmid: firmInfo.firmId,
          cardnum: -1,
          fromday: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
          day: dayjs().format('YYYY-MM-DD'),
        }),
      ).finally(() => setIsLoadingTransactions(false));
    }
  }, [firmInfo, transactions.length, dispatch]);

  if (apiResponseStatus.isLoading || !nomenclature) {
    return <Spinner fullscreen={false} />;
  }

  // const transactionsKpi = {
  //   weekCount: 54,
  //   averageDaily: 200,
  //   totalSpent: 15_000,
  // };

  // Get the latest 5 transactions
  const latestTransactions = transactions.slice(0, 5);

  // Removed hardcoded fuelData

  // const topUsedCards = [
  //   { label: 'Карта #1234', value: '2000 л/нед.' },
  //   { label: 'Карта #5678', value: '1800 л/нед.' },
  // ];

  const cashBalance = firmInfo?.total['1'];
  const cashOverdraft = firmInfo?.fuelVolumeOverdraft['1'];
  const fuelData = firmInfo
    ? Object.entries(firmInfo.fuelVolumeRemain)
        .filter(([fuelId]) => fuelId !== '1')
        .map(([fuelId, value]) => {
          const overdraft = firmInfo.fuelVolumeOverdraft[fuelId];

          const displayValue =
            +overdraft === 0
              ? +value === 0
                ? undefined
                : `${formatNumberWithSpaces(Number(value))} литров`
              : `Перерасход: ${formatNumberWithSpaces(Number(overdraft))} литров`;

          return displayValue ? { [fuelId]: displayValue } : undefined;
        })
        .filter((item): item is NonNullable<typeof item> => item !== undefined)
    : [];

  if (apiResponseStatus.isLoading || !nomenclature) {
    return <Spinner fullscreen={false} />;
  }

  return (
    isLoaded && (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Row 1: Key Metrics */}
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <DashboardCard title="Ключевые метрики">
              {cashBalance && cashBalance !== '0' && (
                <KPIBox
                  label="Баланс"
                  value={
                    cashOverdraft && +cashOverdraft !== 0
                      ? `Перерасход: ${formatNumberWithSpaces(Number(cashOverdraft))} руб.`
                      : `${formatNumberWithSpaces(Number(cashBalance))} руб.`
                  }
                />
              )}
              {fuelData.length > 0 && (
                <KPIBox
                  label="Баланс топлива"
                  value={
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                      {fuelData.map((item) => (
                        <Box
                          key={JSON.stringify(item)}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          {Object.entries(item).map(([key, value]) => (
                            <Fragment key={key}>
                              <FuelChip fuelId={+key} />
                              <Typography sx={{ fontSize: '18px' }}>
                                {value}
                              </Typography>
                            </Fragment>
                          ))}
                        </Box>
                      ))}
                    </Box>
                  }
                />
              )}
              <KPIBox
                label="Активные карты (активно /всего)"
                value={`${activeCards} / ${totalCards}`}
              />
            </DashboardCard>
          </Grid>

          {/* Row 2: Cards with Low Balance */}
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <DashboardCard title="Карты с низким балансом">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {combinedLowBalanceCards.length > 0 ? (
                  combinedLowBalanceCards.map((card) => (
                    <Box
                      key={card.cardNumber}
                      onClick={() =>
                        navigate(
                          `${AppRoute.Cards}?${FILTER_BY_CARD_NUMBER_NAME}=${card.cardNumber}`,
                        )
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
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <CardAvatar cardnum={card.cardNumber} />
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                        }}
                      >
                        {card.walletType === 2 ? (
                          <Typography variant="body2">
                            {formatNumberWithSpaces(Number(card.totalBalance))}{' '}
                            л
                          </Typography>
                        ) : (
                          card.fuelBalances.map((fuel) => (
                            <Box
                              key={fuel.fuelId}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'center', py: 2 }}
                  >
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
          </Grid>

          {/* Row 3: Latest Transactions */}
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <DashboardCard title="Последние транзакции">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {isLoadingTransactions ? (
                  <Spinner fullscreen={false} />
                ) : latestTransactions.length > 0 ? (
                  latestTransactions.map((transaction) => (
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
                      {/* Header */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <CardAvatar cardnum={transaction.cardnum} />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2">
                            АЗС-{transaction.azs}
                          </Typography>
                          <Typography variant="caption" color="text.default">
                            {dayjs(transaction.dt).format(
                              'DD.MM.YYYY HH:mm:ss',
                            )}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Body */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          minWidth: 'fit-content',
                        }}
                      >
                        {/* Fuel */}
                        <Box>
                          <FuelChip fuelId={transaction.fuelid} />
                        </Box>

                        {/* Volume */}
                        <Box>
                          <Typography variant="caption" color="text.default">
                            Объем:
                          </Typography>
                          <Typography variant="body2">
                            {formatNumberWithSpaces(Number(transaction.volume))}{' '}
                            л
                          </Typography>
                        </Box>

                        {/* Amount */}
                        <Box>
                          <Typography variant="caption" color="text.default">
                            {transaction.op === -1 ? 'Списание' : 'Пополнение'}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: transaction.op === -1 ? 'red' : 'green',
                            }}
                          >
                            {formatNumberWithSpaces(
                              Number(transaction.summa.toFixed(2)),
                            )}{' '}
                            ₽
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'center', py: 2 }}
                  >
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
          </Grid>

          {/* Row 4: Map */}
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Box
              onClick={() => {
                navigate(AppRoute.AzsMap);
              }}
              sx={{
                height: '100%',
                minHeight: '300px',
                cursor: 'pointer',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Map mapConfig={{ ...mapConfig }} markers={markers} />
            </Box>
          </Grid>

          {/* Row 5: Contacts */}
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <ContactsBox />
          </Grid>
        </Grid>
      </Box>
    )
  );
}

export default Home;
