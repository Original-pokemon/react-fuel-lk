import { Divider, Typography, Grid2 } from '@mui/material';
import { ApiContractType } from '#root/types';
import { DataListItemProps } from '#root/components/layouts/data-layouts/DataList/DataListItem/DataListItem';
import DataList from '#root/components/layouts/data-layouts/DataList/DataList';
import { DateCell } from '#root/components/cards/CardTable/cells/DateCell/DateCell';
import { formatNumberWithSpaces } from '#root/utils/format-number';
import ContractListHeader from './ContractListHeader';

const getContractBodyElement = ({
  priceTypeString,
  contractEndDate,
  paymentBalance,
  initialAmount,
  totalAmountSpent,
  canSpendRublesWithCredit,
}: ApiContractType): React.ReactElement => (
  <Grid2 container spacing={1}>
    {/* Financial Info */}
    <Grid2 size={12} container columnSpacing={2} rowSpacing={1}>
      <Grid2 size={6}>
        <Typography variant="caption" color="main.light">
          Тип цены:
        </Typography>
        <Typography variant="subtitle2" fontWeight="medium">
          {priceTypeString}
        </Typography>
      </Grid2>

      <Grid2 size={6}>
        <Typography variant="caption" color="main.light">
          Сумма договора:
        </Typography>
        <Typography variant="subtitle2">
          {initialAmount
            ? `${formatNumberWithSpaces(Number(initialAmount))} ₽`
            : '—'}
        </Typography>
      </Grid2>

      <Grid2 size={6}>
        <Typography variant="caption" color="main.light">
          Расход:
        </Typography>
        <Typography variant="subtitle2">
          {totalAmountSpent
            ? `${formatNumberWithSpaces(Number(totalAmountSpent))} ₽`
            : '—'}
        </Typography>
      </Grid2>

      <Grid2 size={6}>
        <Typography variant="caption" color="main.light">
          Можно потратить:
        </Typography>
        <Typography variant="subtitle2">
          {typeof canSpendRublesWithCredit === 'number' &&
          canSpendRublesWithCredit > 999_999_999
            ? 'Работа в кредит'
            : canSpendRublesWithCredit
              ? `${formatNumberWithSpaces(Number(canSpendRublesWithCredit))} ₽`
              : '—'}
        </Typography>
      </Grid2>

      <Grid2 size={6}>
        <Typography variant="caption" color="main.light">
          Сальдо расчетов:
        </Typography>
        <Typography variant="subtitle2">
          {paymentBalance
            ? `${formatNumberWithSpaces(Number(paymentBalance))} ₽`
            : '—'}
        </Typography>
      </Grid2>
    </Grid2>

    <Grid2 size={12}>
      <Divider sx={{ my: 1 }} />
    </Grid2>

    {/* Contract Details */}
    {contractEndDate && (
      <Grid2 size={12}>
        <Typography variant="caption" color="main.light">
          Дата окончания:
        </Typography>
        <DateCell
          value={contractEndDate}
          flexDirection="row"
          backgroundColor="#ffff"
          variant="outlined"
        />
      </Grid2>
    )}
  </Grid2>
);

type ContractListProperties = {
  contracts: ApiContractType[];
  isLoading: boolean;
};

function ContractList({ contracts, isLoading }: ContractListProperties) {
  const contractListItems: DataListItemProps[] = contracts.map((contract) => {
    const bodyElement = getContractBodyElement(contract);
    const headerElement = ContractListHeader(contract);

    return {
      id: contract.firmId.toString(),
      header: headerElement,
      body: bodyElement,
    };
  });

  return <DataList items={contractListItems} isLoading={isLoading} />;
}

export default ContractList;
