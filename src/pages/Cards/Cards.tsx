import {
  Breadcrumbs,
  Link,
  Theme,
  Typography,
  useMediaQuery,
  Tooltip,
  IconButton,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useCallback, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import HomeIcon from '@mui/icons-material/Home';

import CardTable from '#root/components/cards/CardTable/CardTable';
import CardsList from '#root/components/cards/CardsList/CardsList';
import { useAppDispatch, useAppSelector } from '#root/hooks/state';
import {
  fetchFirmData,
  getApiResponseFirmCards,
  getApiResponseStatus,
} from '#root/store';
import Spinner from '#root/components/Spinner/Spinner';
import PageLayout from '#root/components/layouts/PageLayout/PageLayout';
import Filter from '#root/components/Filter/Filter';
import SortMenu from '#root/components/SortMenu/SortMenu';
import DateRangePicker from '#root/components/transactions/DateRangePicker/DateRangePicker';
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

const cardSostOptions = [
  { label: 'Выдана', value: 'выдана' },
  { label: 'Испорчена', value: 'испорчена' },
  { label: 'Утеряна', value: 'утеряна' },
  { label: 'Черный список', value: 'чс' },
];

const filterCards = (
  cards: CardInfoType[],
  cardStatus: string,
  walletType: string,
  cardNumber: string,
  cardSost: string[],
  startDate?: Dayjs,
  endDate?: Dayjs,
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

    // Фильтрация по состоянию карты
    let sostMatch = true;
    if (cardSost.length > 0) {
      sostMatch = cardSost.includes(card.sost);
    } else {
      // По умолчанию показывать только карты со статусом "Выдана"
      sostMatch = card.sost === 'выдана';
    }

    // Фильтрация по дате последней операции
    let dateMatch = true;
    if (cardNumber.trim()) {
      // Если задан номер карты, не фильтруем по дате
      dateMatch = true;
    } else if (startDate && endDate && card.date) {
      const lastOpDate = dayjs(card.date);
      dateMatch =
        lastOpDate.isAfter(startDate.subtract(1, 'day')) &&
        lastOpDate.isBefore(endDate.add(1, 'day'));
    }

    return statusMatch && walletMatch && numberMatch && sostMatch && dateMatch;
  });
};

const FILTER_BY_CARD_NUMBER_NAME = 'filterByCardNumber';
const FILTER_BY_CARD_STATUS_NAME = 'filterByCardStatus';
const FILTER_BY_WALLET_TYPE_NAME = 'filterByWalletType';
const FILTER_BY_CARD_SOST_NAME = 'filterByCardSost';

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
  const cardStatus =
    searchParameters.get(FILTER_BY_CARD_STATUS_NAME) || 'active';
  const walletType = searchParameters.get(FILTER_BY_WALLET_TYPE_NAME) || 'all';
  const cardSostString = searchParameters.get(FILTER_BY_CARD_SOST_NAME);
  const cardSost = cardSostString ? cardSostString.split(',') : ['выдана'];
  const [currentSortOption, setCurrentSortOption] = useState<string>('default');

  // Date range for transaction filtering
  const [startDate, setStartDate] = useState<Dayjs>(
    dayjs().subtract(6, 'month').startOf('month'),
  );
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());

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
          if (value === 'active') {
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

        // Handle card sost filter
        if (selectedFilters[FILTER_BY_CARD_SOST_NAME]) {
          const { options } = selectedFilters[FILTER_BY_CARD_SOST_NAME];
          const valueList = options.map((option) => option.value);
          if (valueList.length > 0) {
            newParameters.set(FILTER_BY_CARD_SOST_NAME, valueList.join(','));
          } else {
            newParameters.delete(FILTER_BY_CARD_SOST_NAME);
          }
        } else {
          newParameters.delete(FILTER_BY_CARD_SOST_NAME);
        }

        return newParameters;
      });
    },
    [cardNumber, setSearchParameters],
  );

  const handleSortChange = (option: string) => {
    setCurrentSortOption(option);
  };

  const handleDateChange = (
    newStartDate: Dayjs | null,
    newEndDate: Dayjs | null,
  ) => {
    if (newStartDate) {
      setStartDate(newStartDate);
    }

    if (newEndDate) {
      setEndDate(newEndDate);
    }
  };

  // Create a map of card numbers to their last transaction date from card data
  const cardLastTransactionMap = useMemo(() => {
    const map = new Map<string, Date>();
    allCards.forEach((card) => {
      if (card.date) {
        const lastOpDate = new Date(card.date);
        // Check if last operation is within the selected date range
        if (
          lastOpDate >= startDate.toDate() &&
          lastOpDate <= endDate.toDate()
        ) {
          map.set(card.cardNumber.toString(), lastOpDate);
        }
      }
    });
    return map;
  }, [allCards, startDate, endDate]);

  const filteredCards = useMemo(() => {
    return filterCards(
      allCards,
      cardStatus,
      walletType,
      cardNumber,
      cardSost,
      startDate,
      endDate,
    );
  }, [
    allCards,
    cardStatus,
    walletType,
    cardNumber,
    cardSost,
    startDate,
    endDate,
  ]);

  const sortedCards = useMemo(() => {
    const cardsCopy = [...filteredCards];
    if (currentSortOption === 'lastTransaction') {
      // Sort by last transaction date within the selected range
      cardsCopy.sort((a, b) => {
        const aLastTransaction = cardLastTransactionMap.get(
          a.cardNumber.toString(),
        );
        const bLastTransaction = cardLastTransactionMap.get(
          b.cardNumber.toString(),
        );

        // Cards with transactions come first, sorted by most recent
        if (aLastTransaction && bLastTransaction) {
          return bLastTransaction.getTime() - aLastTransaction.getTime();
        }
        if (aLastTransaction && !bLastTransaction) {
          return -1;
        }
        if (!aLastTransaction && bLastTransaction) {
          return 1;
        }
        // If neither has transactions, maintain original order
        return 0;
      });
    }
    // Default sorting remains as is
    return cardsCopy;
  }, [filteredCards, currentSortOption, cardLastTransactionMap]);

  useEffect(() => {
    if (isIdle) {
      dispatch(fetchFirmData());
    }
  }, [dispatch, isIdle]);

  if (isLoading) {
    return <Spinner fullscreen={false} />;
  }

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
        <div key="date-filter-section">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}
          >
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              Фильтрация карт по дате последней операции
            </Typography>
            <Tooltip title="Будут показаны только карты, у которых последняя транзакция была в выбранном диапазоне дат">
              <IconButton size="small" sx={{ padding: '2px' }}>
                <InfoIcon fontSize="small" color="action" />
              </IconButton>
            </Tooltip>
          </div>
          <DateRangePicker
            initialStartDate={startDate}
            initialEndDate={endDate}
            onDateChange={handleDateChange}
          />
        </div>,
        <Filter key={2} onChange={handleApplyFilters}>
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

          <Filter.MultipleChoice
            id={FILTER_BY_CARD_SOST_NAME}
            title="Состояние"
            options={cardSostOptions}
            defaultValue={['выдана']}
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
