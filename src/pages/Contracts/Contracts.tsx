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

import ContractTable from '#root/components/contracts/ContractTable/ContractTable';
import ContractList from '#root/components/contracts/ContractList/ContractList';
import { useAppDispatch, useAppSelector } from '#root/hooks/state';
import {
  fetchApiResponseData,
  getApiResponseFirmContracts,
  getApiResponseStatus,
  getFirmId,
} from '#root/store';
import Spinner from '#root/components/Spinner/Spinner';
import PageLayout from '#root/components/layouts/PageLayout/PageLayout';
import AppRoute from '#root/const/app-route';
import ContractsStyledBox from './Contracts.style';

function Contracts() {
  const dispatch = useAppDispatch();
  const { isIdle, isLoading } = useAppSelector(getApiResponseStatus);
  const contracts = useAppSelector(getApiResponseFirmContracts);
  const firmId = useAppSelector(getFirmId);
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );

  useEffect(() => {
    if (isIdle && firmId) {
      dispatch(fetchApiResponseData(firmId));
    }
  }, [dispatch, firmId, isIdle]);

  if (isLoading) {
    return <Spinner fullscreen={false} />;
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
