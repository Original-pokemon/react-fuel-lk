import { Divider, Typography, Grid2 } from '@mui/material';
import { ApiContractType } from '#root/types';
import { DataListItemProps } from '#root/components/layouts/data-layouts/DataList/DataListItem/DataListItem';
import DataList from '#root/components/layouts/data-layouts/DataList/DataList';
import { DateCell } from '#root/components/cards/CardTable/cells/DateCell/DateCell';
import ContractListHeader from './ContractListHeader';

const getContractBodyElement = ({
  contractComment,
  priceTypeString,
  contractStartDate,
  contractEndDate,
  discountMultiplier,
  paymentBalance,
}: ApiContractType): React.ReactElement => (
  <Grid2 container spacing={2}>
    {/* Basic Info */}
    <Grid2 size={12} container columnSpacing={1} rowSpacing={1}>
      <Grid2 size={6}>
        <Typography variant="caption" color="main.light">
          Комментарий:
        </Typography>
        <Typography variant="subtitle2">{contractComment}</Typography>
      </Grid2>

      <Grid2 size={6}>
        <Typography variant="caption" color="main.light">
          Тип цены:
        </Typography>
        <Typography variant="subtitle2">{priceTypeString}</Typography>
      </Grid2>

      <Grid2 size={6}>
        <Typography variant="caption" color="main.light">
          Остаток:
        </Typography>
        <Typography variant="subtitle2">
          {Number.parseFloat(paymentBalance).toFixed(2)}
        </Typography>
      </Grid2>

      <Grid2 size={6}>
        <Typography variant="caption" color="main.light">
          Скидка:
        </Typography>
        <Typography variant="subtitle2">{discountMultiplier}</Typography>
      </Grid2>
    </Grid2>

    <Grid2 size={12}>
      <Divider />
    </Grid2>

    {/* Contract Details */}
    <Grid2 container size={12} spacing={2}>
      {contractStartDate && (
        <Grid2 size={6}>
          <Typography variant="caption" color="main.light">
            Дата начала:
          </Typography>
          <DateCell
            value={contractStartDate}
            flexDirection="row"
            backgroundColor="#ffff"
            variant="outlined"
          />
        </Grid2>
      )}

      {contractEndDate && (
        <Grid2 size={6}>
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
