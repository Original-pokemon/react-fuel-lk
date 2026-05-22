import { useEffect, useState } from "react";
import { Box, Grid2 as Grid, Typography, Button } from "@mui/material";
import dayjs from "dayjs";

import {
  useApiResponseStore,
  useAppStore,
  useTransactionStore,
  useMapMarkersStore,
  useAuthStore,
} from "#root/store";
import { Status } from "#root/const";
import Spinner from "#root/components/Spinner/Spinner";
import { prepareMarkers } from "../../utils/markers";
import PageLayout from "#root/components/layouts/PageLayout/PageLayout";
import ContactsBox from "#root/components/boxes/ContactsBox/ContactsBox";
import KeyMetricsCard from "#root/components/home/KeyMetricsCard/KeyMetricsCard";
import LowBalanceCardsCard from "#root/components/home/LowBalanceCardsCard/LowBalanceCardsCard";
import LatestTransactionsCard from "#root/components/home/LatestTransactionsCard/LatestTransactionsCard";
import AzsMapCard from "#root/components/home/AzsMapCard/AzsMapCard";
import { getLowBalanceCards } from "./getLowBalanceCards";

function Home() {
  const { authData } = useAuthStore();
  const {
    firm: firmInfo,
    status: apiResponseStatus,
    fetchApiResponseData,
    cards,
  } = useApiResponseStore();
  const { nomenclature, fetchNomenclatureData } = useAppStore();
  const { transactions, fetchTransactions } = useTransactionStore();
  const { data: mapMarkers, fetchMapMarkers } = useMapMarkersStore();

  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  const isIdle = apiResponseStatus === Status.Idle;
  const isEmpty = apiResponseStatus === Status.Empty;
  const isError = apiResponseStatus === Status.Error;

  useEffect(() => {
    if (!authData?.firmId) return;
    const { status, firm } = useApiResponseStore.getState();
    if (!firm && status === Status.Idle) {
      fetchApiResponseData(authData.firmId);
    }
  }, [authData?.firmId, fetchApiResponseData]);

  useEffect(() => {
    const { nomenclature: current, status } = useAppStore.getState();
    if (!current && status === Status.Idle) {
      fetchNomenclatureData();
    }
  }, [fetchNomenclatureData]);

  useEffect(() => {
    if (useMapMarkersStore.getState().status === Status.Idle) {
      fetchMapMarkers();
    }
  }, [fetchMapMarkers]);

  useEffect(() => {
    if (!firmInfo) return;
    if (useTransactionStore.getState().transactions.length !== 0) return;

    let cancelled = false;
    setIsLoadingTransactions(true);
    fetchTransactions({
      firmid: firmInfo.firmId,
      cardnum: -1,
      fromday: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
      day: dayjs().format("YYYY-MM-DD"),
    }).finally(() => {
      if (!cancelled) setIsLoadingTransactions(false);
    });

    return () => { cancelled = true; };
  }, [firmInfo, fetchTransactions]);

  const markers = prepareMarkers(mapMarkers || { features: [] });
  const combinedLowBalanceCards = getLowBalanceCards(cards);
  const latestTransactions = transactions.slice(0, 5);
  const totalCards = cards.length;
  const activeCards = cards.filter((c) => !c.blocked).length;

  if (isIdle || apiResponseStatus === Status.Loading || !nomenclature) {
    return <Spinner />;
  }

  if (isError || isEmpty || !firmInfo) {
    return (
      <PageLayout>
        <PageLayout.Content>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              py: 8,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              {isError ? "Ошибка загрузки данных" : "Данные компании недоступны"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isError
                ? "Не удалось получить данные с сервера."
                : "Сервер вернул пустой ответ."}{" "}
              Попробуйте обновить страницу.
            </Typography>
            <Button variant="outlined" onClick={() => window.location.reload()}>
              Обновить страницу
            </Button>
          </Box>
        </PageLayout.Content>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageLayout.Content>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <KeyMetricsCard
              firmInfo={firmInfo}
              activeCards={activeCards}
              totalCards={totalCards}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <LowBalanceCardsCard cards={combinedLowBalanceCards} />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <LatestTransactionsCard
              transactions={latestTransactions}
              isLoading={isLoadingTransactions}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <AzsMapCard markers={markers} />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <ContactsBox />
          </Grid>
        </Grid>
      </PageLayout.Content>
    </PageLayout>
  );
}

export default Home;
