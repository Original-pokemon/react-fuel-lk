import { Typography, Stack, Avatar } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import DataModal from '#root/components/layouts/data-layouts/DataModal/DataModal';
import FuelChip from '#root/components/FuelChip/FuelChip';
import { CardInfoType } from '#root/types';
import LimitCell from '../CardTable/cells/LimitCell/LimitCell';
import WalletTypeCell from '../CardTable/cells/WalletTypeCell/WalletTypeCell';
import StatusCell from '../CardTable/cells/StatusCell/StatusCell';
import InfoBlock from './InfoBlock';
import { DateCell } from '../CardTable/cells/DateCell/DateCell';

type CardModalProperties = {
  card: CardInfoType;
};

function CardModal({ card }: CardModalProperties) {
  const [, setSearchParameters] = useSearchParams();

  const handleClose = () => {
    setSearchParameters((previousValue) => {
      previousValue.delete('modalcardnum');

      return previousValue;
    });
  };

  return (
    <DataModal
      open
      onClose={handleClose}
      title={
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          bgcolor="background.default"
          borderRadius={1}
          p={1}
          gap={1}
        >
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: '2.8rem',
              height: '1.8rem',
              borderRadius: '0.28rem',
            }}
            variant="rounded"
            src="/images/card.png"
          />
          <Typography variant="h6">{card.cardNumber}</Typography>
        </Stack>
      }
    >
      <Stack spacing={2} sx={{ p: 2 }}>
        {/* Детали карты */}
        <InfoBlock
          title="Детали карты"
          rows={[
            {
              label: 'Владелец карты',
              value: <Typography variant="body1">{card.cardOwner}</Typography>,
            },
            {
              label: 'Статус',
              value: <StatusCell value={Boolean(card.blocked)} />,
            },
            {
              label: 'Последняя операция',
              value: <DateCell value={card.date} />,
            },
            {
              label: 'Тип кошелька',
              value: <WalletTypeCell value={card.walletType} />,
            },
          ]}
          direction="row"
          borderBetweenRows
          borderBetweenColumns
        />

        {/* Лимиты */}
        <InfoBlock
          title="Лимиты"
          rows={[
            {
              label: 'Дневной лимит',
              value: (
                <LimitCell limit={+card.dayLimit} remain={+card.dayRemain} />
              ),
            },
            {
              label: 'Месячный лимит',
              value: (
                <LimitCell
                  limit={+card.monthLimit}
                  remain={+card.monthRemain}
                />
              ),
            },
          ]}
          direction="column"
          borderBetweenColumns
          borderBetweenRows
        />

        {/* Секция доступного топлива */}
        <InfoBlock
          title="Доступное топливо"
          rows={
            card.wallets
              ? Object.entries(card.wallets).map(([key, value]) => ({
                label: <FuelChip fuelId={+key} />,
                value: <Typography variant="body1">{value}</Typography>,
              }))
              : [
                {
                  label: '',
                  value: (
                    <Typography variant="body1">
                      Нет доступного топлива
                    </Typography>
                  ),
                },
              ]
          }
          direction="row"
          borderBetweenColumns
          borderBetweenRows
        />
      </Stack>
    </DataModal>
  );
}

export default CardModal;
