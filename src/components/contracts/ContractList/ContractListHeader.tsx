import { Typography } from '@mui/material';
import type { DataListItemHeaderPropertiesType } from '#root/components/layouts/data-layouts/DataList/DataListItem/DataListItemHeader';

const ContractListHeader = ({
  contractNumber,
}: {
  contractNumber: string;
}): DataListItemHeaderPropertiesType => ({
  title: <Typography variant="h6">{contractNumber}</Typography>,
});

export default ContractListHeader;
