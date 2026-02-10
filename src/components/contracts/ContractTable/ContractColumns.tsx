import { GridColDef } from '@mui/x-data-grid';
import { getContrastRatio } from '@mui/material';
import { formatNumberWithSpaces } from '#root/utils/format-number';
import type { BalancesType, BalanceType } from '#root/types/api-response';
import theme from '#root/styles/theme';
import { DateCell } from '#root/components/cards/CardTable/cells/DateCell/DateCell';

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

const ContractColumns: GridColDef[] = [
  {
    field: 'code',
    headerName: 'Номер договора',
    display: 'flex',
    align: 'left',
    headerAlign: 'left',
    type: 'string',
    hideable: false,
  },
  {
    field: 'fuelname',
    headerName: 'Тип цен',
    display: 'flex',
    align: 'left',
    headerAlign: 'left',
    type: 'string',
  },
  {
    field: 'dsumma',
    headerName: 'Сумма договора',
    display: 'flex',
    align: 'left',
    headerAlign: 'left',
    type: 'number',
    valueFormatter: (value: number) => {
      if (value === undefined || value === null) return;
      return Number(value.toFixed(2));
    },
    renderCell: (parameters) =>
      parameters.value === undefined
        ? '—'
        : formatNumberWithSpaces(parameters.value),
  },
  {
    field: 'spent',
    headerName: 'Расход',
    display: 'flex',
    align: 'left',
    headerAlign: 'left',
    type: 'number',
    valueFormatter: (value: number) => {
      if (value === undefined || value === null) return;
      return Number(value.toFixed(2));
    },
    renderCell: (parameters) =>
      parameters.value === undefined
        ? '—'
        : formatNumberWithSpaces(parameters.value),
  },
  {
    field: 'canSpend',
    headerName: 'Можно потратить по договору',
    display: 'flex',
    align: 'left',
    headerAlign: 'left',
    type: 'number',
    valueFormatter: (value: number) =>
      value === undefined ? undefined : Number(value.toFixed(2)),
    renderCell: (parameters) =>
      parameters.value === undefined
        ? '—'
        : typeof parameters.value === 'number' && parameters.value > 999_999_999
          ? 'Работа в кредит'
          : formatNumberWithSpaces(parameters.value),
  },
  {
    field: 'moneyRemain',
    headerName: 'Сальдо расчетов',
    display: 'flex',
    align: 'left',
    headerAlign: 'left',
    type: 'number',
    valueFormatter: (value: number) => {
      if (value === undefined) return;
      return Number(value.toFixed(2));
    },
    renderCell: (parameters) =>
      parameters.value === undefined
        ? '—'
        : formatNumberWithSpaces(parameters.value),
  },
  {
    field: 'fuelRemain',
    headerName: 'Остатки',
    display: 'flex',
    align: 'left',
    headerAlign: 'left',
    type: 'string',
    width: 220,
    renderCell: (parameters) => {
      const balances = parameters.value;
      if (!balances || typeof balances !== 'object') return '-';

      const fuelList = Object.values(balances as BalancesType)
        .flatMap((balance) => Object.values(balance))
        .map((balanceInfo: BalanceType) => {
          const fuelConfig = getFuelConfig(balanceInfo.fuelId);
          const pcc =
            parameters.row.priceType === 33
              ? `[${balanceInfo.initialPrice}]`
              : '';
          const liters = Number.parseFloat(
            balanceInfo.canSpendLitersWithCredit,
          );
          const rubles = Number.parseFloat(
            balanceInfo.canSpendRublesWithCredit,
          );
          const overdraftLiters = Number.parseFloat(
            balanceInfo.overdraftLiters,
          );

          if (liters > 0.01) {
            return `<span style="background-color: ${fuelConfig.color}; color: ${fuelConfig.textColor}; padding: 2px 6px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; margin-right: 4px;">${fuelConfig.name}${pcc}</span><br/><span style="margin-left: 8px;">${formatNumberWithSpaces(Number(liters.toFixed(2)))} л.</span><br/><span style="margin-left: 8px;">${formatNumberWithSpaces(Number(rubles.toFixed(2)))} руб.</span>`;
          }
          if (overdraftLiters < -0.01) {
            return `<span style="background-color: ${fuelConfig.color}; color: ${fuelConfig.textColor}; padding: 2px 6px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; margin-right: 4px;">${fuelConfig.name}${pcc}</span><br/><span style="margin-left: 8px; color: #d32f2f;">-${formatNumberWithSpaces(Math.abs(Number(overdraftLiters.toFixed(2))))} л.</span><br/><span style="margin-left: 8px; color: #d32f2f;">-${formatNumberWithSpaces(Math.abs(Number(Number.parseFloat(balanceInfo.overdraftRubles).toFixed(2))))} руб.</span>`;
          }
        })
        .filter(Boolean);

      return fuelList.length > 0 ? (
        <table
          style={{
            borderCollapse: 'collapse',
            fontSize: '0.875rem',
            lineHeight: '1.4',
          }}
        >
          <tbody>
            {fuelList.map((fuel, index) => (
              <tr key={`fuel-${index}`}>
                <td
                  style={{
                    padding: '2px 4px',
                    borderTop: index === 0 ? 'none' : '1px solid #e0e0e0',
                    borderBottom:
                      index === fuelList.length - 1
                        ? 'none'
                        : '1px solid #e0e0e0',
                  }}
                  dangerouslySetInnerHTML={{ __html: fuel! }}
                />
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        '—'
      );
    },
  },
  {
    field: 'contractEndDate',
    headerName: 'Дата окончания',
    display: 'flex',
    align: 'left',
    headerAlign: 'left',
    type: 'date',
    valueGetter: (value) => (value ? new Date(value) : undefined),
    renderCell: (parameters) => (
      <DateCell
        value={parameters.value}
        flexDirection="row"
        backgroundColor="#ffff"
        variant="outlined"
      />
    ),
  },
];

export default ContractColumns;
