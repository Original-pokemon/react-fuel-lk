import { Outlet, useSearchParams } from 'react-router-dom';
import {
  Home as HomeIcon,
  CreditCard as CreditCardIcon,
  Receipt as ReceiptIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import { getApiResponseFirmCardById } from '#root/store';
import { useAppSelector } from '#root/hooks/state';
import AppRoute from '#root/const/app-route';
import MainMenu from '../MainMenu/MainMenu';
import Navbar from '../Navbar/Navbar';
import LayoutStyleBox from './Layout.style';
import CardModal from '../cards/CardModal/CardModal';
import SideMenu from '../SideMenu/SideMenu';
import Footer from '../Footer/Footer';

const menu = [
  {
    id: 1,
    title: 'Основное',
    listItems: [
      {
        id: 1,
        title: 'Главная',
        url: AppRoute.Main,
        icon: <HomeIcon />,
      },
      {
        id: 4,
        title: 'Карта АЗС',
        url: AppRoute.AzsMap,
        icon: <MapIcon />,
      },
    ],
  },
  {
    id: 2,
    title: 'О картах',
    listItems: [
      {
        id: 1,
        title: 'Карты',
        url: AppRoute.Cards,
        icon: <CreditCardIcon />,
      },
      {
        id: 2,
        title: 'Транзакции',
        url: AppRoute.Transaction,
        icon: <ReceiptIcon />,
      },
    ],
  },
];

function Layout() {
  const [searchParameters] = useSearchParams();
  const cardnumber = Number(searchParameters.get('modalcardnum'));
  const card = useAppSelector((state) =>
    getApiResponseFirmCardById(state, cardnumber),
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSideMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsSideMenuOpen(false);
  };

  return (
    <LayoutStyleBox className="main">
      <Navbar className="navbar" onMenuClick={handleMenuClick} />

      {isMobile && (
        <SideMenu open={isSideMenuOpen} onClose={handleMenuClose} menu={menu} />
      )}

      <Box className="container">
        {!isMobile && (
          <Box className="menuContainer">
            <MainMenu menu={menu} onClick={handleMenuClose} />
          </Box>
        )}
        <Box className="contentContainer">
          <Outlet />
        </Box>
      </Box>

      {card && createPortal(<CardModal card={card} />, document.body)}
      <Footer className="footer" />
    </LayoutStyleBox>
  );
}

export default Layout;
