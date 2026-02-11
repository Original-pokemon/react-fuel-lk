import {
  Breadcrumbs,
  Link,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useEffect } from "react";
import HomeIcon from "@mui/icons-material/Home";

import ContractTable from "#root/components/contracts/ContractTable/ContractTable";
import ContractList from "#root/components/contracts/ContractList/ContractList";
import { useApiResponseStore, useAuthStore } from "#root/store";
import { useApi } from "#root/hooks";
import { Status } from "#root/const";
import Spinner from "#root/components/Spinner/Spinner";
import PageLayout from "#root/components/layouts/PageLayout/PageLayout";
import AppRoute from "#root/const/app-route";
import ContractsStyledBox from "./Contracts.style";

function Contracts() {
  const api = useApi();
  const { authData } = useAuthStore();
  const { firm, status, fetchApiResponseData } = useApiResponseStore();

  const isIdle = status === Status.Idle;
  const isLoading = status === Status.Loading;
  const contracts = firm?.contracts;
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm"),
  );

  useEffect(() => {
    if (isIdle && authData?.firmId) {
      fetchApiResponseData(authData.firmId, api);
    }
  }, [isIdle, authData?.firmId, fetchApiResponseData, api]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <PageLayout
      title="Договоры"
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
          <Typography color="text.primary">Договоры</Typography>
        </Breadcrumbs>
      }
      content={
        <ContractsStyledBox className="contracts">
          {isSmallScreen ? (
            <ContractList contracts={contracts || []} isLoading={isLoading} />
          ) : (
            <ContractTable contracts={contracts || []} />
          )}
        </ContractsStyledBox>
      }
    />
  );
}

export default Contracts;
