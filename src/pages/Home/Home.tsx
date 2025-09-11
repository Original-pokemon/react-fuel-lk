import { useEffect } from 'react';
import { Box, Grid2 as Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { useAppDispatch, useAppSelector } from '#root/hooks/state';
import {
  getFirmCards,
  getFirmInfo,
  getFirmStatus,
} from '#root/store/slice/firm/selectors';
import Spinner from '#root/components/Spinner/Spinner';
import { fetchFirmData, getAppStatus, getNomenclatureInfo } from '#root/store';
import DashboardCard from '#root/components/home/DashboardCard/DashboardCard';
import KPIBox from '#root/components/home/KPIBox/KPIBox';
import type { TransactionType } from '#root/types';
import ContactsBox from '#root/components/boxes/ContactsBox/ContactsBox';
import AppRoute from '#root/const/app-route';
import { useNavigate } from 'react-router-dom';

import {
  ExpenseDynamicsChartCard,
  FuelBalanceCard,
} from '#root/components/home/boxes/boxex';
import ODINTSOVO_COORD from '../../const/map';
import { prepareMarkers } from '../../utils/markers';
import mapInfo from '../../mock/map-info';
import Map from '../../components/Map/Map';

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
  const firmInfo = useAppSelector(getFirmInfo);
  const cards = useAppSelector(getFirmCards);
  const nomenclature = useAppSelector(getNomenclatureInfo);

  const firmStatus = useAppSelector(getFirmStatus);
  const appStatus = useAppSelector(getAppStatus);

  const isLoaded = firmStatus.isSuccess && firmInfo;

  const blockedCardsCount = cards.filter((c) => c.blocked).length;
  const lowLimitCardsCount = cards.filter(
    (card) =>
      card.dayremain < card.daylimit * 0.1 ||
      card.monthremain < card.monthlimit * 0.1,
  ).length;

  useEffect(() => {
    if (!firmInfo && firmStatus.isIdle) {
      dispatch(fetchFirmData());
    }
  }, [dispatch, firmInfo, firmStatus.isIdle]);

  if (firmStatus.isLoading) {
    return <Spinner fullscreen />;
  }

  // const transactionsKpi = {
  //   weekCount: 54,
  //   averageDaily: 200,
  //   totalSpent: 15_000,
  // };

  // Generate mock transaction data for the last 30 days
  const mockTransactions: TransactionType[] = [];
  const today = dayjs();

  for (let dayIndex = 0; dayIndex < 30; dayIndex += 1) {
    const date = today.subtract(dayIndex, 'day');
    // Generate 1-5 random transactions per day
    const transactionsPerDay = Math.floor(Math.random() * 5) + 1;

    for (let txIndex = 0; txIndex < transactionsPerDay; txIndex += 1) {
      mockTransactions.push({
        confirmed: 1,
        dt: date.format('YYYY-MM-DD HH:mm:ss'),
        firmid: firmInfo?.firmid || 1,
        cardnum: Math.floor(Math.random() * 9999) + 1000,
        op: -1, // Debit operation (expense)
        summa: Math.floor(Math.random() * 5000) + 500, // Random amount between 500-5500 rubles
        volume: Math.floor(Math.random() * 50) + 10, // Random volume between 10-60 liters
        fuelid: Math.floor(Math.random() * 3) + 1, // Random fuel type 1-3
        azs: Math.floor(Math.random() * 100) + 1,
        price: 50 + Math.random() * 20, // Random price between 50-70 rubles per liter
      });
    }
  }

  // Removed hardcoded fuelData

  // const topUsedCards = [
  //   { label: 'Карта #1234', value: '2000 л/нед.' },
  //   { label: 'Карта #5678', value: '1800 л/нед.' },
  // ];

  return (
    isLoaded && (
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <DashboardCard title="Ключевые метрики">
              <KPIBox
                label="Доступно сейчас:"
                value={firmInfo.firmcash.conf > 0 ? firmInfo.firmcash.conf : 0}
              />
              <KPIBox
                label="Задолжность:"
                value={firmInfo.firmcash.conf < 0 ? firmInfo.firmcash.conf : 0}
              />
              {/* <KPIBox
                label="Транзакций в неделю"
                value={transactionsKpi.weekCount}
              /> */}
              {/* Заблокированные карты */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  cursor: blockedCardsCount > 0 ? 'pointer' : 'default',
                }}
                onClick={
                  blockedCardsCount > 0
                    ? () => navigate('/cards?status=blocked')
                    : undefined
                }
              >
                <Typography variant="body2" color="text.main">
                  Заблокированные карты:
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: blockedCardsCount > 0 ? '#D32F2F' : 'text.primary',
                  }}
                >
                  {blockedCardsCount}
                </Typography>
              </Box>
              {/* Карты с низким лимитом */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  cursor: lowLimitCardsCount > 0 ? 'pointer' : 'default',
                }}
                onClick={
                  lowLimitCardsCount > 0
                    ? () => navigate('/cards?limit_status=10')
                    : undefined
                }
              >
                <Typography variant="body2" color="text.main">
                  Карты с низким лимитом:
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: lowLimitCardsCount > 0 ? '#F57C00' : 'text.primary',
                  }}
                >
                  {lowLimitCardsCount}
                </Typography>
              </Box>
            </DashboardCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <ExpenseDynamicsChartCard transactions={mockTransactions} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <ContactsBox />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} />

          <Grid size={{ xs: 12, md: 4 }}>
            {appStatus.isSuccess && (
              <FuelBalanceCard
                fuelWallet={firmInfo.firmwallet}
                nomenclature={nomenclature || []}
              />
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              onClick={() => {
                navigate(AppRoute.AzsMap);
              }}
            >
              <Map mapConfig={{ ...mapConfig }} markers={markers} />
            </Box>
            {/* <DashboardCard title="Самые используемые карты">
              <DataListBox items={topUsedCards} />
            </DashboardCard> */}
          </Grid>

          {/* <Grid size={{ xs: 12, md: 6 }}>
            <DashboardCard title="Карты с низким лимитом">
              <NearingLimitCardsCard cards={cards} threshold={90} />
            </DashboardCard>
          </Grid> */}
        </Grid>
      </Box>
    )
  );
}

export default Home;
