import {
  Breadcrumbs,
  Link,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';

import CardTable from '#root/components/cards/CardTable/CardTable';
import CardsList from '#root/components/cards/CardsList/CardsList';
import { useAppDispatch, useAppSelector } from '#root/hooks/state';
import { fetchFirmData, getFirmCards, getFirmStatus } from '#root/store';
import PageLayout from '#root/components/layouts/PageLayout/PageLayout';
import AppRoute from '#root/const/app-route';
import Filter from '#root/components/Filter/Filter';
import { SelectedFiltersType } from '#root/components/Filter/types';
import { CardType } from '#root/types';
import CardsStyledBox from './Cards.style';

const cardTypeOptions = [
  { label: 'Кошелёк', value: '1' },
  { label: 'Пополнение', value: '2' },
  { label: 'Разовая', value: '3' },
];

const cardStatusOptions = [
  { label: 'Все', value: 'all' },
  { label: 'Активна', value: 'false' },
  { label: 'Заблокирована', value: 'true' },
];

const FILTER_BY_LIMIT_STATUS = 'limit_status';
const FILTER_BY_CARD_STATUS = 'card_status';
const FILTER_BY_CARD_TYPE = 'card_type';

const filterCards = (
  cards: CardType[],
  cardStatus: string,
  cardType: number[],
): CardType[] => {
  return cards.filter((card) => {
    const cardStatusMatch =
      cardStatus === 'all' ? true : card.blocked === Boolean(cardStatus);

    const cardTypeMatch =
      cardType.length > 0 ? cardType.includes(card.wallettype) : true;

    let cardLimitStatusMatch = true

    card.lgr

    return cardStatusMatch && cardTypeMatch;
  });
};

function Cards() {
  const dispatch = useAppDispatch();
  const { isIdle, isLoading } = useAppSelector(getFirmStatus);
  const cards = useAppSelector(getFirmCards);
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );
  const [searchParameters, setSearchParameters] = useSearchParams();
  const cardStatusParameter =
    searchParameters.get(FILTER_BY_CARD_STATUS) || undefined;
  const [cardStatus, setCardStatus] = useState<string>('all');
  const cardLimitStatusParameter =
    searchParameters.get(FILTER_BY_LIMIT_STATUS) || 100;
  const [cardLimitStatus, setCardLimitStatus] = useState<number>(
    +cardLimitStatusParameter,
  );
  const cardTypeParameter = searchParameters.get(FILTER_BY_LIMIT_STATUS) || 0;
  const [cardType, setCardType] = useState<number[]>([]);

  const handleApplyFilters = useCallback(
    (selectedFilters: SelectedFiltersType) => {
      if (selectedFilters[FILTER_BY_LIMIT_STATUS]) {
        setCardLimitStatus(
          +selectedFilters[FILTER_BY_LIMIT_STATUS].options[0].value,
        );
      } else {
        setCardLimitStatus(100);
      }

      if (selectedFilters[FILTER_BY_CARD_STATUS]) {
        setCardStatus(selectedFilters[FILTER_BY_CARD_STATUS].options[0].value);
      } else {
        setCardStatus('all');
      }

      if (selectedFilters[FILTER_BY_CARD_TYPE]) {
        const { options } = selectedFilters[FILTER_BY_CARD_TYPE];
        const valueList = options.map((option) => +option.value);
        setCardType(valueList);
      } else {
        setCardType([]);
      }
    },
    [cardStatus, cardLimitStatus],
  );

  useEffect(() => {
    if (isIdle) {
      dispatch(fetchFirmData());
    }
  }, [dispatch, isIdle]);

  return (
    <PageLayout>
      <PageLayout.Breadcrumbs>
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
      </PageLayout.Breadcrumbs>
      <PageLayout.Title>Карты</PageLayout.Title>
      <PageLayout.Toolbar>
        <PageLayout.Filters>
          <Filter key={2} onChange={handleApplyFilters}>
            <Filter.SliderChoice
              id={FILTER_BY_LIMIT_STATUS}
              title="По остатку лимита"
              defaultValue={cardLimitStatus}
              step={10}
              marks={[
                { label: '0%', value: 0 },
                { label: '50%', value: 50 },
                { label: '100%', value: 100 },
              ]}
            />

            <Filter.SingleChoice
              id={FILTER_BY_CARD_STATUS}
              title="Статус карты"
              defaultValue={cardStatus}
              options={cardStatusOptions}
            />

            <Filter.MultipleChoice
              id={FILTER_BY_CARD_TYPE}
              title="Тип карты"
              options={cardTypeOptions}
            />
          </Filter>
        </PageLayout.Filters>
      </PageLayout.Toolbar>
      <PageLayout.Content>
        <CardsStyledBox className="cards">
          {isSmallScreen ? (
            <CardsList cards={cards} isLoading={isLoading} />
          ) : (
            <CardTable cards={cards} />
          )}
        </CardsStyledBox>
      </PageLayout.Content>
    </PageLayout>
  );
}

export default Cards;
