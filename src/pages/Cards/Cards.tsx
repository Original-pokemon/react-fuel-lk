import {
  Breadcrumbs,
  Link,
  Theme,
  Typography,
  useMediaQuery,
  Tooltip,
  IconButton,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useCallback, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import HomeIcon from "@mui/icons-material/Home";

import CardTable from "#root/components/cards/CardTable/CardTable";
import CardsList from "#root/components/cards/CardsList/CardsList";
import MonthlyExpensesView from "#root/components/cards/monthly-expenses/MonthlyExpensesView";
import ReportPreviewModal from "#root/components/cards/ReportPreviewModal";
import {
  useApiResponseStore,
  useTransactionStore,
  useAppStore,
  useAuthStore,
  useReportStore,
} from "#root/store";
import { Status } from "#root/const";
import aggregateMonthlyExpenses from "#root/utils/monthly-expenses";
import { base64ToBlob, downloadBlob } from "#root/utils/file-download";
import Spinner from "#root/components/Spinner/Spinner";
import PageLayout from "#root/components/layouts/PageLayout/PageLayout";
import Filter from "#root/components/Filter/Filter";
import SortMenu from "#root/components/SortMenu/SortMenu";
import DateRangePicker from "#root/components/transactions/DateRangePicker/DateRangePicker";
import type { CardInfoType } from "#root/types/api-response";
import type { SelectedFiltersType } from "#root/components/Filter/types";
import AppRoute from "#root/const/app-route";
import CardsStyledBox from "./Cards.style";

const cardStatusOptions = [
  { label: "Все", value: "all" },
  { label: "Активные", value: "active" },
  { label: "Заблокированные", value: "blocked" },
];

const walletTypeOptions = [
  { label: "Все", value: "all" },
  { label: "Кошелек", value: "1" },
  { label: "Лимитный", value: "2" },
];

const cardSostOptions = [
  { label: "Выдана", value: "выдана" },
  { label: "Испорчена", value: "испорчена" },
  { label: "Утеряна", value: "утеряна" },
  { label: "Черный список", value: "чс" },
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
    if (cardStatus === "active") {
      statusMatch = card.blocked === 0;
    } else if (cardStatus === "blocked") {
      statusMatch = card.blocked === 1;
    }

    // Фильтрация по типу кошелька
    let walletMatch = true;
    if (walletType !== "all") {
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
      sostMatch = card.sost === "выдана";
    }

    // Фильтрация по дате последней операции
    let dateMatch = true;
    if (cardNumber.trim()) {
      // Если задан номер карты, не фильтруем по дате
      dateMatch = true;
    } else if (startDate && endDate && card.date) {
      const lastOpDate = dayjs(card.date);
      dateMatch =
        lastOpDate.isAfter(startDate.subtract(1, "day")) &&
        lastOpDate.isBefore(endDate.add(1, "day"));
    }

    return statusMatch && walletMatch && numberMatch && sostMatch && dateMatch;
  });
};

const FILTER_BY_CARD_NUMBER_NAME = "filterByCardNumber";
const FILTER_BY_CARD_STATUS_NAME = "filterByCardStatus";
const FILTER_BY_WALLET_TYPE_NAME = "filterByWalletType";
const FILTER_BY_CARD_SOST_NAME = "filterByCardSost";
const ACTIVE_TAB_NAME = "tab";

const sortOptions = [
  { label: "По умолчанию", value: "default" },
  { label: "По последней транзакции", value: "lastTransaction" },
];

function Cards() {
  const { authData } = useAuthStore();
  const {
    status: apiResponseStatus,
    cards: allCards,
    fetchApiResponseData,
  } = useApiResponseStore();
  const { transactions, fetchTransactions } = useTransactionStore();
  const { nomenclature } = useAppStore();
  const { fetchReport, getReport, isMonthLoading, isMonthCached } =
    useReportStore();

  const isIdle = apiResponseStatus === Status.Idle;
  const isLoading = apiResponseStatus === Status.Loading;

  const [searchParameters, setSearchParameters] = useSearchParams();

  // filters
  const cardNumber = searchParameters.get(FILTER_BY_CARD_NUMBER_NAME) || "";
  const cardStatus =
    searchParameters.get(FILTER_BY_CARD_STATUS_NAME) || "active";
  const walletType = searchParameters.get(FILTER_BY_WALLET_TYPE_NAME) || "all";
  const cardSostString = searchParameters.get(FILTER_BY_CARD_SOST_NAME);
  const cardSost = cardSostString ? cardSostString.split(",") : ["выдана"];
  const [currentSortOption, setCurrentSortOption] = useState<string>("default");
  const activeTabParameter = searchParameters.get(ACTIVE_TAB_NAME);
  const [activeTab, setActiveTab] = useState<number>(
    activeTabParameter ? Number.parseInt(activeTabParameter, 10) : 0,
  );
  const [isReportLoading, setIsReportLoading] = useState<boolean>(false);

  // Date range for transaction filtering
  const [startDate, setStartDate] = useState<Dayjs>(
    dayjs().subtract(6, "month").startOf("month"),
  );
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());

  // Report preview state
  const [showReportPreview, setShowReportPreview] = useState<boolean>(false);
  const [previewMonthKey, setPreviewMonthKey] = useState<string | null>(null);

  const availabilityDay = 4;

  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm"),
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
          if (value === "active") {
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
          if (value === "all") {
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
            newParameters.set(FILTER_BY_CARD_SOST_NAME, valueList.join(","));
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

  const handleGenerateMonthReport = async (monthKey: string) => {
    if (!authData?.firmId) return;

    // Проверяем, есть ли отчет в кеше
    const isCached = isMonthCached(monthKey, authData.firmId);

    try {
      await fetchReport(monthKey, authData.firmId);
      // Показываем preview только если отчет уже был в кеше (повторный клик)
      if (isCached) {
        setPreviewMonthKey(monthKey);
        setShowReportPreview(true);
      }
    } catch (error) {
      alert("Не удалось загрузить отчет. Попробуйте позже.");
    }
  };

  const handleDownloadPdf = () => {
    if (!authData?.firmId || !previewMonthKey) return;

    const report = getReport(previewMonthKey, authData.firmId);
    if (!report?.pdf) return;

    const blob = base64ToBlob(report.pdf, "application/pdf");
    downloadBlob(blob, `отчет_${previewMonthKey.replace("-", "_")}.pdf`);
  };

  const handleDownloadExcel = () => {
    if (!authData?.firmId || !previewMonthKey) return;

    const report = getReport(previewMonthKey, authData.firmId);
    if (!report?.xlsx) return;

    const blob = base64ToBlob(
      report.xlsx,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    downloadBlob(blob, `отчет_${previewMonthKey.replace("-", "_")}.xlsx`);
  };

  const handleClosePreview = () => {
    setShowReportPreview(false);
    setPreviewMonthKey(null);
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
    if (currentSortOption === "lastTransaction") {
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

  // Агрегируем данные о месячных расходах
  const monthlyExpensesData = useMemo(() => {
    return aggregateMonthlyExpenses(
      transactions,
      nomenclature || [],
      startDate.toDate(),
      endDate.toDate(),
      availabilityDay,
    );
  }, [transactions, nomenclature, startDate, endDate, availabilityDay]);

  useEffect(() => {
    if (isIdle && authData?.firmId) {
      fetchApiResponseData(authData.firmId);
    }
  }, [isIdle, authData?.firmId, fetchApiResponseData]);

  // Загружаем транзакции для отчета по расходам
  useEffect(() => {
    setIsReportLoading(true);
    fetchTransactions(
      {
        firmid: authData?.firmId || -1,
        cardnum: -1, // Получаем все карты
        fromday: startDate.format("YYYY-MM-DD"),
        day: endDate.format("YYYY-MM-DD"),
      },
    ).finally(() => {
      setIsReportLoading(false);
    });
  }, [startDate, endDate, authData?.firmId, fetchTransactions]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
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
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                  Фильтрация карт по дате последней операции
                </Typography>
                <Tooltip title="Будут показаны только карты, у которых последняя транзакция была в выбранном диапазоне дат">
                  <IconButton size="small" sx={{ padding: "2px" }}>
                    <InfoIcon fontSize="small" color="action" />
                  </IconButton>
                </Tooltip>
              </div>
              <DateRangePicker
                initialStartDate={startDate}
                initialEndDate={endDate}
                onDateChange={handleDateChange}
              />
            </div>
            <Filter onChange={handleApplyFilters}>
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
                defaultValue={["выдана"]}
              />
            </Filter>
          </PageLayout.Filters>
          <PageLayout.Sorting>
            <SortMenu
              label="Сортировка"
              onSortChange={handleSortChange}
              currentSort={currentSortOption}
              sortOptions={sortOptions}
            />
          </PageLayout.Sorting>
        </PageLayout.Toolbar>
        <PageLayout.Content>
          <Box>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => {
                setActiveTab(newValue);
                setSearchParameters((previous) => {
                  const newParameters = new URLSearchParams(previous);
                  if (newValue === 0) {
                    newParameters.delete(ACTIVE_TAB_NAME);
                  } else {
                    newParameters.set(ACTIVE_TAB_NAME, newValue.toString());
                  }
                  return newParameters;
                });
              }}
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                mb: 2,
                "& .MuiTab-root": {
                  color: "text.primary",
                  "&.Mui-selected": {
                    color: "text.primary",
                  },
                },
              }}
            >
              <Tab label="Карты" />
              <Tab label="Отчет по топливу" />
            </Tabs>

            {activeTab === 0 && (
              <CardsStyledBox className="cards">
                {isSmallScreen ? (
                  <CardsList cards={sortedCards} isLoading={isLoading} />
                ) : (
                  <CardTable cards={sortedCards} />
                )}
              </CardsStyledBox>
            )}

            {activeTab === 1 &&
              (isReportLoading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "200px",
                  }}
                >
                  <Spinner />
                </Box>
              ) : (
                <MonthlyExpensesView
                  data={monthlyExpensesData}
                  startDate={startDate}
                  endDate={endDate}
                  onGenerateReport={handleGenerateMonthReport}
                  isMonthLoading={isMonthLoading}
                  isMonthCached={(monthKey) =>
                    isMonthCached(monthKey, authData?.firmId || 0)
                  }
                />
              ))}
          </Box>
        </PageLayout.Content>
      </PageLayout>
      <ReportPreviewModal
        open={showReportPreview}
        pdfBase64={
          previewMonthKey && authData?.firmId
            ? getReport(previewMonthKey, authData.firmId)?.pdf || null
            : null
        }
        onClose={handleClosePreview}
        onDownloadPdf={handleDownloadPdf}
        onDownloadExcel={handleDownloadExcel}
      />
    </>
  );
}

export default Cards;
