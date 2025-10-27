import { useEffect, Fragment } from 'react';
import { Box, Grid2 as Grid, Typography } from '@mui/material';
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
} from '#root/store';
import DashboardCard from '#root/components/home/DashboardCard/DashboardCard';
// import DataListBox from '#root/components/home/DataListBox/DataListBox';
import KPIBox from '#root/components/home/KPIBox/KPIBox';
// import {
//   CardsInfoCard,
//   FuelBalanceCard,
//   ExpenseDynamicsChartCard, // Import the new component
// } from '#root/components/home/boxes/boxex';
import type { TransactionType } from '#root/types';
import ContactsBox from '#root/components/boxes/ContactsBox/ContactsBox';
import AppRoute from '#root/const/app-route';
import { useNavigate } from 'react-router-dom';
// import HomeStyledBox from './Home.style';
import FuelChip from '#root/components/FuelChip/FuelChip';
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
  const firmInfo = useAppSelector(getApiResponseFirm);
  const cards = useAppSelector(getApiResponseFirmCards);
  const nomenclature = useAppSelector(getNomenclatureInfo);

  const apiResponseStatus = useAppSelector(getApiResponseStatus);
  const { isIdle } = useAppSelector(getAppStatus);

  const isLoaded = apiResponseStatus.isSuccess && firmInfo;

  const totalCards = cards.length;
  const activeCards = cards.filter((c) => !c.blocked).length;

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

  if (apiResponseStatus.isLoading || !nomenclature) {
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
        firmid: firmInfo?.firmId || 1,
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

  const cashBalance = firmInfo?.fuelVolumeRemain['1'];
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
                : `${value} литров`
              : `Перерасход: ${overdraft} литров`;

          return displayValue ? { [fuelId]: displayValue } : undefined;
        })
      .filter((item): item is NonNullable<typeof item> => item !== undefined)
    : [];
  const virtualFuelData = firmInfo
    ? Object.entries(firmInfo.virtualCard)
      .map(([fuelId, value]) => {
        const displayValue = +value === 0 ? undefined : `${value} литров`;

        return displayValue ? { [fuelId]: displayValue } : undefined;
      })
      .filter((item): item is NonNullable<typeof item> => item !== undefined)
    : [];

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
              {cashBalance && cashBalance !== '0' && (
                <KPIBox
                  label="Баланс"
                  value={
                    cashOverdraft && +cashOverdraft !== 0
                      ? `Перерасход: ${cashOverdraft} руб.`
                      : `${cashBalance} руб.`
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
              {virtualFuelData.length > 0 && (
                <KPIBox
                  label="Зарезервированное топливо"
                  value={
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                      {virtualFuelData.map((item) => (
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
              {/* <KPIBox
                label="Баланс"
                value={firmInfo.fuelVolumeRemain.conf > 0 ? firmInfo.firmcash. : 0}
              /> * */}
              {/* <KPIBox
                label="Задолженность"
                value={firmInfo.firmcash.conf < 0 ? firmInfo.firmcash.conf : 0}
              /> */}
              {/* <KPIBox
                label="Транзакций в неделю"
                value={transactionsKpi.weekCount}
              /> */}
              <KPIBox
                label="Активные карты (активно /всего)"
                value={`${activeCards} / ${totalCards}`}
              />
            </DashboardCard>
          </Grid>

          {/* <Grid size={{ xs: 12, md: 6 }}>
            <ExpenseDynamicsChartCard transactions={mockTransactions} />
          </Grid> */}

          <Grid size={{ xs: 12, md: 4 }}>
            <ContactsBox />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} />

          {/* <Grid size={{ xs: 12, md: 4 }}>
            {appStatus.isSuccess && (
              <FuelBalanceCard
                fuelWallet={firmInfo.firmwallet}
                nomenclature={nomenclature || []}
              />
            )}
          </Grid> */}

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
