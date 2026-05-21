import { useState, useEffect } from 'react';
import {
  Typography,
  Stack,
  Avatar,
  IconButton,
  TextField,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import DataModal from '#root/components/layouts/data-layouts/DataModal/DataModal';
import FuelChip from '#root/components/FuelChip/FuelChip';
import { CardInfoType } from '#root/types';
import { useApiResponseStore } from '#root/store';
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
  const { updateCardOwner } = useApiResponseStore();

  const [isEditing, setIsEditing] = useState(false);
  const [ownerValue, setOwnerValue] = useState(card.cardOwner);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setOwnerValue(card.cardOwner);
    }
  }, [card.cardOwner, isEditing]);

  const handleClose = () => {
    setSearchParameters((previousValue) => {
      previousValue.delete('modalcardnum');
      return previousValue;
    });
  };

  const handleSave = async () => {
    const trimmed = ownerValue.trim();
    if (trimmed === card.cardOwner) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await updateCardOwner(card.cardNumber, trimmed);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setOwnerValue(card.cardOwner);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  const ownerValueNode = isEditing ? (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <TextField
        size="small"
        value={ownerValue}
        onChange={(e) => setOwnerValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSaving}
        autoFocus
        sx={{ maxWidth: 200 }}
      />
      <IconButton size="small" onClick={handleSave} disabled={isSaving}>
        {isSaving ? (
          <CircularProgress size={16} />
        ) : (
          <CheckIcon fontSize="small" color="success" />
        )}
      </IconButton>
      <IconButton size="small" onClick={handleCancel} disabled={isSaving}>
        <CloseIcon fontSize="small" color="error" />
      </IconButton>
    </Stack>
  ) : (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Typography variant="body1">
        {card.cardOwner.trim() || 'Не указано'}
      </Typography>
      <IconButton size="small" onClick={() => setIsEditing(true)}>
        <EditIcon fontSize="small" />
      </IconButton>
    </Stack>
  );

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
              value: ownerValueNode,
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
