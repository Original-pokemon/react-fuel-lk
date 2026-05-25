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
  const { updateCardOwner, updateCardLimit } = useApiResponseStore();

  const [isEditing, setIsEditing] = useState(false);
  const [ownerValue, setOwnerValue] = useState(card.cardOwner);
  const [isSaving, setIsSaving] = useState(false);

  const [editingLimit, setEditingLimit] = useState<'day' | 'month' | null>(null);
  const [limitValue, setLimitValue] = useState('');
  const [isSavingLimit, setIsSavingLimit] = useState(false);

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

  const handleEditLimit = (field: 'day' | 'month') => {
    const raw = field === 'day' ? card.dayLimit : card.monthLimit;
    setLimitValue(String(Math.round(+raw)));
    setEditingLimit(field);
  };

  const handleSaveLimit = async () => {
    const newValue = Math.max(0, Number(limitValue));
    const dayLimit = editingLimit === 'day' ? newValue : +card.dayLimit;
    const monthLimit = editingLimit === 'month' ? newValue : +card.monthLimit;

    if (dayLimit === +card.dayLimit && monthLimit === +card.monthLimit) {
      setEditingLimit(null);
      return;
    }

    setIsSavingLimit(true);
    try {
      await updateCardLimit(card.cardNumber, dayLimit, monthLimit);
      setEditingLimit(null);
    } finally {
      setIsSavingLimit(false);
    }
  };

  const handleCancelLimit = () => setEditingLimit(null);

  const handleLimitKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveLimit();
    if (e.key === 'Escape') handleCancelLimit();
  };

  const renderLimitValue = (field: 'day' | 'month') => {
    const limit = field === 'day' ? +card.dayLimit : +card.monthLimit;
    const remain = field === 'day' ? +card.dayRemain : +card.monthRemain;

    if (editingLimit === field) {
      const limitChanged = Math.max(0, Number(limitValue)) !== limit;
      return (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <TextField
            size="small"
            type="number"
            value={limitValue}
            onChange={(e) => setLimitValue(e.target.value)}
            onKeyDown={handleLimitKeyDown}
            disabled={isSavingLimit}
            autoFocus
            inputProps={{ min: 0 }}
            sx={{ maxWidth: 120 }}
          />
          <IconButton size="small" onClick={handleSaveLimit} disabled={isSavingLimit || !limitChanged}>
            {isSavingLimit ? (
              <CircularProgress size={16} />
            ) : (
              <CheckIcon fontSize="small" color={limitChanged ? 'success' : 'disabled'} />
            )}
          </IconButton>
          <IconButton size="small" onClick={handleCancelLimit} disabled={isSavingLimit}>
            <CloseIcon fontSize="small" color="error" />
          </IconButton>
        </Stack>
      );
    }

    return (
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <LimitCell limit={limit} remain={remain} />
        <IconButton size="small" onClick={() => handleEditLimit(field)}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Stack>
    );
  };

  const ownerChanged = ownerValue.trim() !== card.cardOwner;

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
      <IconButton size="small" onClick={handleSave} disabled={isSaving || !ownerChanged}>
        {isSaving ? (
          <CircularProgress size={16} />
        ) : (
          <CheckIcon fontSize="small" color={ownerChanged ? 'success' : 'disabled'} />
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
            { label: 'Дневной лимит', value: renderLimitValue('day') },
            { label: 'Месячный лимит', value: renderLimitValue('month') },
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
