import { Divider, Typography, Grid2, getContrastRatio } from '@mui/material';
import { ApiContractType } from '#root/types';
import { DataListItemProps } from '#root/components/layouts/data-layouts/DataList/DataListItem/DataListItem';
import DataList from '#root/components/layouts/data-layouts/DataList/DataList';
import { DateCell } from '#root/components/cards/CardTable/cells/DateCell/DateCell';
import { formatNumberWithSpaces } from '#root/utils/format-number';
import theme from '#root/styles/theme';
import type { BalancesType, BalanceType } from '#root/types/api-response';
import ContractListHeader from './ContractListHeader';

// Fuel name and color mapping based on fuel IDs
const fuelConfigMap: Record<number, { name: string; color: string }> = {
  14: { name: 'АИ-92', color: theme.palette.fuelColors[14] },
  15: { name: 'АИ-95', color: theme.palette.fuelColors[15] },
  19: { name: 'АИ-95 PROF', color: theme.palette.fuelColors[19] },
  21: { name: 'АИ-100 PROF', color: theme.palette.fuelColors[21] },
  17: { name: 'ДТ', color: theme.palette.fuelColors[17] },
  18: { name: 'ГАЗ', color: theme.palette.fuelColors[18] },
};

// Helper function to get fuel config with proper text color
const getFuelConfig = (fuelId: number) => {
  const config = fuelConfigMap[fuelId] || {
    name: `Fuel ${fuelId}`,
    color: '#666',
  };
  const textColor =
    getContrastRatio(config.color, theme.palette.common.black) > 4.5
      ? theme.palette.text.primary
      : theme.palette.text.secondary;

  return { ...config, textColor };
};

const getContractBodyElement = ({
  priceTypeString,
  contractEndDate,
  paymentBalance,
  initialAmount,
  totalAmountSpent,
  canSpendRublesWithCredit,
  balances,
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
          {typeof canSpendRublesWithCredit === 'string' &&
            Number(canSpendRublesWithCredit) > 999_999_999
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

    {/* Fuel Balances */}
    {balances &&
      (() => {
        const fuelChips = Object.values(balances as BalancesType)
          .flatMap((balance) => Object.values(balance))
          .map((balanceInfo: BalanceType) => {
            const fuelConfig = getFuelConfig(balanceInfo.fuelId);
            const liters = Number.parseFloat(
              balanceInfo.canSpendLitersWithCredit,
            );
            const rubles = Number.parseFloat(
              balanceInfo.canSpendRublesWithCredit,
            );

            if (liters > 0.01) {
              return (
                <div
                  key={balanceInfo.fuelId}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    marginRight: '8px',
                    marginBottom: '4px',
                  }}
                >
                  <span
                    style={{
                      backgroundColor: fuelConfig.color,
                      color: fuelConfig.textColor,
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      marginRight: '4px',
                    }}
                  >
                    {fuelConfig.name}
                  </span>
                  <span style={{ fontSize: '0.75rem' }}>
                    {formatNumberWithSpaces(Number(liters.toFixed(2)))} л,{' '}
                    {formatNumberWithSpaces(Number(rubles.toFixed(2)))} ₽
                  </span>
                </div>
              );
            }
          })
          .filter(Boolean);

        return fuelChips.length > 0 ? (
          <Grid2 size={12}>
            <Typography variant="caption" color="main.light">
              Остатки топлива:
            </Typography>
            <div style={{ marginTop: '4px' }}>{fuelChips}</div>
          </Grid2>
        ) : undefined;
      })()}

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
