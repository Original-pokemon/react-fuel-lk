import { useEffect, useState, useMemo, useCallback } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import {
  Box,
  Breadcrumbs,
  Link,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import TransactionsTable from '#root/components/transactions/TransactionsTable/TransactionsTable';
import {
  fetchTransactions,
  getAllTransactions,
  getNomenclatureInfo,
  getTransactionStatus,
} from '#root/store';
import Spinner from '#root/components/Spinner/Spinner';
import { useAppDispatch, useAppSelector } from '#root/hooks/state';
import DateRangePicker from '#root/components/transactions/DateRangePicker/DateRangePicker';
import TransactionsList from '#root/components/transactions/TransactionsList/TransactionsList';
import SortMenu from '#root/components/SortMenu/SortMenu';
import PageLayout from '#root/components/layouts/PageLayout/PageLayout';
import Filter from '#root/components/Filter/Filter';
import type { TransactionType } from '#root/types';
import AppRoute from '#root/const/app-route';
import type {
  FilterOption,
  SelectedFiltersType,
} from '#root/components/Filter/types';

const lastTransactionsOption = {
  label: 'Последние ',
  value: 'last',
};
const firstTransactionsOption = {
  label: 'Первые',
  value: 'first',
};

const sortOptions = [lastTransactionsOption, firstTransactionsOption];

const transactionTypeOptions = [
  { label: 'Все', value: 'all' },
  { label: 'Списание', value: '-1' },
  { label: 'Пополнение', value: '1' },
];

const filterTransactions = (
  transactions: TransactionType[],
  transactionType: string,
  fuelType: string[],
): TransactionType[] => {
  return transactions.filter((transaction) => {
    // Фильтрация по transactionType
    let transactionTypeMatch = true;

    if (transactionType !== 'all') {
      transactionTypeMatch = transaction.op === Number(transactionType);
    }

    // Фильтрация по fuelType
    let fuelTypeMatch = true;
    if (fuelType.length > 0) {
      fuelTypeMatch = fuelType.includes(String(transaction.fuelid));
    }

    // Возвращаем true только если обе проверки проходят
    return transactionTypeMatch && fuelTypeMatch;
  });
};

const FILTER_BY_CARD_NAME = 'filterbycard';
const FILTER_BY_TRANSACTION_TYPE_NAME = 'filterByTransactionType';
const FILTER_BY_FUEL_TYPE_NAME = 'filterByFuelType';

function Transitions() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(getAllTransactions);
  const nomenclature = useAppSelector(getNomenclatureInfo);
  const fuelTypeOptions = useMemo(() => {
    if (!nomenclature) {
      return [];
    }
    const array: FilterOption[] = [];

    nomenclature.forEach(({ fuelid, fuelname }) => {
      const currencyDesignationId = 1;

      if (fuelid === currencyDesignationId) {
        return;
      }

      array.push({ label: fuelname, value: String(fuelid) });
    });
    return array;
  }, [nomenclature]);

  const [searchParameters, setSearchParameters] = useSearchParams();
  const { isLoading: isLoadingTransactions } =
    useAppSelector(getTransactionStatus);

  // filters
  const cardNumber = searchParameters.get(FILTER_BY_CARD_NAME) || undefined;
  const transactionType =
    searchParameters.get(FILTER_BY_TRANSACTION_TYPE_NAME) || 'all';
  const fuelTypeString = searchParameters.get(FILTER_BY_FUEL_TYPE_NAME);
  const fuelType = fuelTypeString ? fuelTypeString.split(',') : [];
  const [startDate, setStartDate] = useState<Dayjs>(
    dayjs().subtract(6, 'month').startOf('month'),
  );
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [currentSortOption, setCurrentSortOption] = useState<string>(
    lastTransactionsOption.value,
  );

  const tableName = `transactions-${startDate.format('YYYY-MM-DD')}-${endDate.format('YYYY-MM-DD')}`;

  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );

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

  const handleApplyFilters = useCallback(
    (selectedFilters: SelectedFiltersType) => {
      setSearchParameters((previous) => {
        const newParameters = new URLSearchParams(previous);

        // Handle card number filter
        if (selectedFilters[FILTER_BY_CARD_NAME]) {
          const { options } = selectedFilters[FILTER_BY_CARD_NAME];
          const { value } = options[0];
          if (value.trim()) {
            newParameters.set(FILTER_BY_CARD_NAME, value.trim());
          } else {
            newParameters.delete(FILTER_BY_CARD_NAME);
          }
        } else if (cardNumber) {
          newParameters.delete(FILTER_BY_CARD_NAME);
        }

        // Handle transaction type filter
        if (selectedFilters[FILTER_BY_TRANSACTION_TYPE_NAME]) {
          const { options } = selectedFilters[FILTER_BY_TRANSACTION_TYPE_NAME];
          const { value } = options[0];
          if (value === 'all') {
            newParameters.delete(FILTER_BY_TRANSACTION_TYPE_NAME);
          } else {
            newParameters.set(FILTER_BY_TRANSACTION_TYPE_NAME, value);
          }
        } else {
          newParameters.delete(FILTER_BY_TRANSACTION_TYPE_NAME);
        }

        // Handle fuel type filter
        if (selectedFilters[FILTER_BY_FUEL_TYPE_NAME]) {
          const { options } = selectedFilters[FILTER_BY_FUEL_TYPE_NAME];
          const valueList = options.map((option) => option.value);
          if (valueList.length > 0) {
            newParameters.set(FILTER_BY_FUEL_TYPE_NAME, valueList.join(','));
          } else {
            newParameters.delete(FILTER_BY_FUEL_TYPE_NAME);
          }
        } else {
          newParameters.delete(FILTER_BY_FUEL_TYPE_NAME);
        }

        return newParameters;
      });
    },
    [cardNumber, setSearchParameters],
  );

  const handleSortChange = (option: string) => {
    setCurrentSortOption(option);
  };

  const filteredTransactions = useMemo(() => {
    return filterTransactions(transactions, transactionType, fuelType);
  }, [transactions, transactionType, fuelType]);

  const sortedTransactions = useMemo(() => {
    const transactionsCopy = [...filteredTransactions];
    if (currentSortOption === lastTransactionsOption.value) {
      // Сортируем по дате от новых к старым
      transactionsCopy.sort(
        (a, b) => new Date(b.dt).getTime() - new Date(a.dt).getTime(),
      );
    } else if (currentSortOption === firstTransactionsOption.value) {
      // Сортируем по дате от старых к новым
      transactionsCopy.sort(
        (a, b) => new Date(a.dt).getTime() - new Date(b.dt).getTime(),
      );
    }
    return transactionsCopy;
  }, [filteredTransactions, currentSortOption]);

  useEffect(() => {
    dispatch(
      fetchTransactions({
        firmid: -1,
        cardnum: Number(cardNumber) || -1,
        fromday: startDate.format('YYYY-MM-DD'),
        day: endDate.format('YYYY-MM-DD'),
      }),
    );
  }, [dispatch, startDate, endDate, cardNumber]);

  if (isLoadingTransactions) {
    return <Spinner fullscreen />;
  }

  return (
    <PageLayout
      title="Транзакции"
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
          <Typography color="text.primary">Транзакции</Typography>
        </Breadcrumbs>
      }
      filters={[
        <DateRangePicker
          key={1}
          initialStartDate={startDate}
          initialEndDate={endDate}
          onDateChange={handleDateChange}
        />,
        <Filter key={2} onChange={handleApplyFilters}>
          <Filter.FilterTextField
            id={FILTER_BY_CARD_NAME}
            title="Номер карты"
            defaultValue={cardNumber || ''}
          />

          <Filter.SingleChoice
            id={FILTER_BY_TRANSACTION_TYPE_NAME}
            title="Тип операции"
            defaultValue={transactionType}
            options={transactionTypeOptions}
          />

          <Filter.MultipleChoice
            id={FILTER_BY_FUEL_TYPE_NAME}
            title="Топливо"
            options={fuelTypeOptions}
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
        <Box
          className="transactions-table"
          bgcolor={isSmallScreen ? 'background.default' : 'background.paper'}
          padding={2}
          borderRadius="10px"
        >
          {isSmallScreen ? (
            <TransactionsList
              transactions={sortedTransactions}
              isLoading={isLoadingTransactions}
            />
          ) : (
            <TransactionsTable
              name={tableName}
              transactions={sortedTransactions}
              isLoading={isLoadingTransactions}
            />
          )}
        </Box>
      }
    />
  );
}

export default Transitions;
