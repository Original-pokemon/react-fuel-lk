import { Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import CardAvatar from '#root/components/CardAvatar/CardAvatar';
import { DataListItemHeaderPropertiesType } from '#root/components/layouts/data-layouts/DataList/DataListItem/DataListItemHeader';
import { TransactionType } from '#root/types';

const TransactionHeaderProperties = (
  transaction: TransactionType,
): DataListItemHeaderPropertiesType => {
  const { dt, azs, cardnum } = transaction;

  const formattedDate = dayjs(dt).format('DD.MM.YYYY HH:mm:ss');

  return {
    avatar: <CardAvatar cardnum={cardnum} />,
    title: (
      <Stack direction="column" spacing={0} alignItems="flex-start">
        <Typography variant="body2">АЗС-{azs}</Typography>
        <Typography variant="caption" color="text.default">
          {formattedDate}
        </Typography>
      </Stack>
    ),
  };
};

export default TransactionHeaderProperties;
