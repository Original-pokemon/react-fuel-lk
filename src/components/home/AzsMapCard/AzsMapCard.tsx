import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AppRoute from '#root/const/app-route';
import Map from '#root/components/Map/Map';
import ODINTSOVO_COORD from '#root/const/map';

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

type AzsMapCardProps = {
  markers: { position: [number, number]; popupContent?: string }[];
};

function AzsMapCard({ markers }: AzsMapCardProps) {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate(AppRoute.AzsMap)}
      sx={{
        height: '100%',
        minHeight: '300px',
        cursor: 'pointer',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Map mapConfig={mapConfig} markers={markers} />
    </Box>
  );
}

export default AzsMapCard;
