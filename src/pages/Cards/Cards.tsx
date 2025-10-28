import {
  Breadcrumbs,
  Link,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useCallback, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';

import CardTable from '#root/components/cards/CardTable/CardTable';
import CardsList from '#root/components/cards/CardsList/CardsList';
import { useAppDispatch, useAppSelector } from '#root/hooks/state';
import {
  fetchFirmData,
  getApiResponseFirmCards,
  getApiResponseStatus,
} from '#root/store';
import PageLayout from '#root/components/layouts/PageLayout/PageLayout';
import Filter from '#root/components/Filter/Filter';
import SortMenu from '#root/components/SortMenu/SortMenu';
import type { CardInfoType } from '#root/types/api-response';
import type { SelectedFiltersType } from '#root/components/Filter/types';
import AppRoute from '#root/const/app-route';
import CardsStyledBox from './Cards.style';

const cardStatusOptions = [
  { label: 'Все', value: 'all' },
  { label: 'Активные', value: 'active' },
  { label: 'Заблокированные', value: 'blocked' },
];

const walletTypeOptions = [
  { label: 'Все', value: 'all' },
  { label: 'Кошелек', value: '1' },
  { label: 'Лимитный', value: '2' },
];

const filterCards = (
  cards: CardInfoType[],
  cardStatus: string,
  walletType: string,
  cardNumber: string,
): CardInfoType[] => {
  return cards.filter((card) => {
    // Фильтрация по статусу карты
    let statusMatch = true;
    if (cardStatus === 'active') {
      statusMatch = card.blocked === 0;
    } else if (cardStatus === 'blocked') {
      statusMatch = card.blocked === 1;
    }

    // Фильтрация по типу кошелька
    let walletMatch = true;
    if (walletType !== 'all') {
      walletMatch = card.walletType === Number(walletType);
    }

    // Фильтрация по номеру карты
    let numberMatch = true;
    if (cardNumber.trim()) {
      numberMatch = card.cardNumber.toString().includes(cardNumber.trim());
    }

    return statusMatch && walletMatch && numberMatch;
  });
};

const FILTER_BY_CARD_NUMBER_NAME = 'filterByCardNumber';
const FILTER_BY_CARD_STATUS_NAME = 'filterByCardStatus';
const FILTER_BY_WALLET_TYPE_NAME = 'filterByWalletType';

const sortOptions = [
  { label: 'По умолчанию', value: 'default' },
  { label: 'По последней транзакции', value: 'lastTransaction' },
];

function Cards() {
  const dispatch = useAppDispatch();
  const { isIdle, isLoading } = useAppSelector(getApiResponseStatus);
  const allCards = useAppSelector(getApiResponseFirmCards);
  const [searchParameters, setSearchParameters] = useSearchParams();

  // filters
  const cardNumber = searchParameters.get(FILTER_BY_CARD_NUMBER_NAME) || '';
  const cardStatus = searchParameters.get(FILTER_BY_CARD_STATUS_NAME) || 'all';
  const walletType = searchParameters.get(FILTER_BY_WALLET_TYPE_NAME) || 'all';
  const [currentSortOption, setCurrentSortOption] = useState<string>('default');

  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );

  const handleApplyFilters = useCallback(
    (selectedFilters: SelectedFiltersType) => {
      setSearchParameters((previous) => {
        const newParameters = new URLSearchParams(previous);

        // Handle card number filter
        if (selectedFilters[FILTER_BY_CARD_NUMBER_NAME]) {
          const { options } = selectedFilters[FILTER_BY_CARD_NUMBER_NAME];
          const { value } = options[0];
          if (value.trim()) {
            newParameters.set(FILTER_BY_CARD_NUMBER_NAME, value.trim());
          } else {
            newParameters.delete(FILTER_BY_CARD_NUMBER_NAME);
          }
        } else if (cardNumber) {
          newParameters.delete(FILTER_BY_CARD_NUMBER_NAME);
        }

        // Handle card status filter
        if (selectedFilters[FILTER_BY_CARD_STATUS_NAME]) {
          const { options } = selectedFilters[FILTER_BY_CARD_STATUS_NAME];
          const { value } = options[0];
          if (value === 'all') {
            newParameters.delete(FILTER_BY_CARD_STATUS_NAME);
          } else {
            newParameters.set(FILTER_BY_CARD_STATUS_NAME, value);
          }
        } else {
          newParameters.delete(FILTER_BY_CARD_STATUS_NAME);
        }

        // Handle wallet type filter
        if (selectedFilters[FILTER_BY_WALLET_TYPE_NAME]) {
          const { options } = selectedFilters[FILTER_BY_WALLET_TYPE_NAME];
          const { value } = options[0];
          if (value === 'all') {
            newParameters.delete(FILTER_BY_WALLET_TYPE_NAME);
          } else {
            newParameters.set(FILTER_BY_WALLET_TYPE_NAME, value);
          }
        } else {
          newParameters.delete(FILTER_BY_WALLET_TYPE_NAME);
        }

        return newParameters;
      });
    },
    [cardNumber, setSearchParameters],
  );

  const handleSortChange = (option: string) => {
    setCurrentSortOption(option);
  };

  const filteredCards = useMemo(() => {
    return filterCards(allCards, cardStatus, walletType, cardNumber);
  }, [allCards, cardStatus, walletType, cardNumber]);

  const sortedCards = useMemo(() => {
    const cardsCopy = [...filteredCards];
    if (currentSortOption === 'lastTransaction') {
      // Sort by last transaction date (assuming cards have a date field)
      cardsCopy.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    }
    // Default sorting remains as is
    return cardsCopy;
  }, [filteredCards, currentSortOption]);

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
      filters={[
        <Filter key={1} onChange={handleApplyFilters}>
          <Filter.FilterTextField
            id={FILTER_BY_CARD_NUMBER_NAME}
            title="Номер карты"
            defaultValue={cardNumber}
          />

          <Filter.SingleChoice
            id={FILTER_BY_CARD_STATUS_NAME}
            title="Статус карты"
            defaultValue={cardStatus}
            options={cardStatusOptions}
          />

          <Filter.SingleChoice
            id={FILTER_BY_WALLET_TYPE_NAME}
            title="Тип кошелька"
            defaultValue={walletType}
            options={walletTypeOptions}
          />
        </Filter>,
      ]}
      sorting={
        <SortMenu
          label="Сортировка"
          onSortChange={handleSortChange}
          currentSort={currentSortOption}
          sortOptions={sortOptions}
        />
      }
      content={
        <CardsStyledBox className="cards">
          {isSmallScreen ? (
            <CardsList cards={sortedCards} isLoading={isLoading} />
          ) : (
            <CardTable cards={sortedCards} />
          )}
        </CardsStyledBox>
      }
    />
  );
}

export default Cards;
