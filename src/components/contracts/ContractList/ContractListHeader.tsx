import { Typography } from '@mui/material';
import type { DataListItemHeaderPropertiesType } from '#root/components/layouts/data-layouts/DataList/DataListItem/DataListItemHeader';
import type { ApiContractType } from '#root/types';

const ContractListHeader = ({
  contractNumber,
}: ApiContractTypeв): DataListItemHeaderPropertiesType => ({
  title: <Typography variant="h6">{contractNumber}</Typography>,
});

export default ContractListHeader;
