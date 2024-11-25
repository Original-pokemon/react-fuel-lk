import {
  Breadcrumbs,
  Link,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useEffect } from 'react';
import HomeIcon from '@mui/icons-material/Home';

import CardTable from '#root/components/cards/CardTable/CardTable';
import CardsList from '#root/components/cards/CardsList/CardsList';
import { useAppDispatch, useAppSelector } from '#root/hooks/state';
import { fetchFirmData, getFirmCards, getFirmStatus } from '#root/store';
import PageLayout from '#root/components/layouts/PageLayout/PageLayout';
import AppRoute from '#root/const/app-route';
import CardsStyledBox from './Cards.style';

function Cards() {
  const dispatch = useAppDispatch();
  const { isIdle, isLoading } = useAppSelector(getFirmStatus);
  const cards = useAppSelector(getFirmCards);
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );

  useEffect(() => {
    if (isIdle) {
      dispatch(fetchFirmData());
    }
  }, [dispatch, isIdle]);

  return (
    <PageLayout
      title="Карты"
      breadcrumbs={
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
          color="primary.light"
        >
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to={AppRoute.Main}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Главная
          </Link>
          <Typography color="text.primary">Карты</Typography>
        </Breadcrumbs>
      }
      content={
        <CardsStyledBox className="cards">
          {isSmallScreen ? (
            <CardsList cards={cards} isLoading={isLoading} />
          ) : (
            <CardTable cards={cards} />
          )}
        </CardsStyledBox>
      }
    />
  );
}

export default Cards;
