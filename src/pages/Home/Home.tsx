import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Box } from '@mui/material';

import { useAppDispatch, useAppSelector } from '#root/hooks/state';
import {
  getFirmCards,
  getFirmInfo,
  getFirmStatus,
} from '#root/store/slice/firm/selectors';
import Spinner from '#root/components/Spinner/Spinner';
import FirmCashDisplay from '#root/components/boxes/FirmCashDisplay/FirmCashDisplay';
import { fetchFirmData } from '#root/store/slice/firm/thunk';
import FirmWalletDisplay from '#root/components/boxes/FirmWalletDisplay/FirmWalletDisplay';
import CardsSummary from '#root/components/boxes/CardsSummary/FirmCards';
import ContactsBox from '#root/components/boxes/ContactsBox/ContactsBox';
import AppRoute from '#root/const/app-route';
import DashboardCard from '#root/components/home/DashboardCard/DashboardCard';
import KPIBox from '#root/components/home/KPIBox/KPIBox';
import HomeStyledBox from './Home.style';
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
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isSuccess, isIdle, isLoading } = useAppSelector(getFirmStatus);
  const firmInfo = useAppSelector(getFirmInfo);
  const cards = useAppSelector(getFirmCards);
  const isLoaded = isSuccess && firmInfo;

  useEffect(() => {
    if (!firmInfo && isIdle) {
      dispatch(fetchFirmData());
    }
  }, [dispatch, firmInfo, isIdle]);

  if (isLoading) {
    return <Spinner fullscreen />;
  }

  return (
    isLoaded && (
      <HomeStyledBox className="home">
        <Box className="box box1">
          <DashboardCard title="Ключевые метрики">
            <KPIBox label="Баланс" value={firmInfo.firmcash.conf} />
            <KPIBox
              label="Задолжность"
              value={firmInfo.firmcash.unconf ?? 'Нет данных'}
            />
            {/* <KPIBox
              label="Транзакций в неделю"
              value={transactionsKpi.weekCount}
            />
            <KPIBox
              label="Активные карты (активно /всего)"
              value={`${activeCards} / ${totalCards}`}
            /> */}
          </DashboardCard>
        </Box>
        {/* <Box className="box box2">
          <FirmWalletDisplay fuelWallet={firmInfo.firmwallet} />
        </Box> */}
        {/* <Box className="box box3">
          <CardsSummary cards={cards} />
        </Box> */}
        <Box className="box box4">
          <ContactsBox />
        </Box>
        <Box
          className="box box7"
          onClick={() => {
            navigate(AppRoute.AzsMap);
          }}
        >
          <Map mapConfig={{ ...mapConfig }} markers={markers} />
        </Box>
      </HomeStyledBox>
    )
  );
}

export default Home;
