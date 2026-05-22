import { Fragment } from 'react';
import { Box, Typography } from '@mui/material';
import { FirmDataType } from '#root/types';
import { formatNumberWithSpaces } from '#root/utils/format-number';
import FuelChip from '#root/components/FuelChip/FuelChip';
import DashboardCard from '../DashboardCard/DashboardCard';
import KPIBox from '../KPIBox/KPIBox';

type FuelBalanceItem = Record<string, string>;

function getFuelData(firmInfo: FirmDataType): FuelBalanceItem[] {
  return Object.entries(firmInfo.fuelVolumeRemain)
    .filter(([fuelId]) => fuelId !== '1')
    .map(([fuelId, value]) => {
      const overdraft = firmInfo.fuelVolumeOverdraft[fuelId];
      const displayValue =
        +overdraft === 0
          ? +value === 0
            ? undefined
            : `${formatNumberWithSpaces(Number(value))} литров`
          : `Перерасход: ${formatNumberWithSpaces(Number(overdraft))} литров`;
      return displayValue ? { [fuelId]: displayValue } : undefined;
    })
    .filter((item): item is FuelBalanceItem => item !== undefined);
}

type KeyMetricsCardProps = {
  firmInfo: FirmDataType;
  activeCards: number;
  totalCards: number;
};

function getSpendingLabel(cashBalance: string | number, cashOverdraft?: string): string {
  if (cashOverdraft && +cashOverdraft !== 0) {
    return `Перерасход: ${formatNumberWithSpaces(Number(cashOverdraft))} руб.`;
  }
  if (cashBalance === 'кредит') {
    return 'Работа в кредит';
  }
  if (typeof cashBalance === 'string' && Number.isNaN(Number(cashBalance))) {
    return cashBalance;
  }
  return `${formatNumberWithSpaces(Number(cashBalance))} руб.`;
}

function KeyMetricsCard({ firmInfo, activeCards, totalCards }: KeyMetricsCardProps) {
  const cashBalance = firmInfo.canSpendStringRubles;
  const cashOverdraft = firmInfo.fuelVolumeOverdraft['1'];
  const fuelData = getFuelData(firmInfo);
  const spendingLabel = cashBalance && cashBalance !== '0'
    ? getSpendingLabel(cashBalance, cashOverdraft)
    : null;

  return (
    <DashboardCard title="Ключевые метрики">
      {spendingLabel && (
        <KPIBox
          label="Можно потратить по договору"
          value={spendingLabel}
        />
      )}
      {cashBalance === 'кредит' && firmInfo.total[1] && (
        <KPIBox
          label="Сальдо расчетов"
          value={`${formatNumberWithSpaces(Number(firmInfo.total[1]))} руб.`}
        />
      )}
      {fuelData.length > 0 && (
        <KPIBox
          label="Баланс топлива"
          value={
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {fuelData.map((item) => (
                <Box
                  key={JSON.stringify(item)}
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  {Object.entries(item).map(([key, value]) => (
                    <Fragment key={key}>
                      <FuelChip fuelId={+key} />
                      <Typography sx={{ fontSize: '18px' }}>{value}</Typography>
                    </Fragment>
                  ))}
                </Box>
              ))}
            </Box>
          }
        />
      )}
      <KPIBox
        label="Активные карты (активно / всего)"
        value={`${activeCards} / ${totalCards}`}
      />
    </DashboardCard>
  );
}

export default KeyMetricsCard;
