import { Typography } from '@mui/material';
import type { DataListItemHeaderPropertiesType } from '#root/components/layouts/data-layouts/DataList/DataListItem/DataListItemHeader';
import type { ApiContractType } from '#root/types';

const ContractListHeader = ({
  contractNumber,
  contractComment,
}: ApiContractType): DataListItemHeaderPropertiesType => ({
  title: (
    <Typography variant="h6">{`${contractNumber} - ${contractComment}`}</Typography>
  ),
});

export default ContractListHeader;
