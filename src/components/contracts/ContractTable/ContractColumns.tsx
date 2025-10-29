import { GridColDef } from '@mui/x-data-grid';
import { formatNumberWithSpaces } from '#root/utils/format-number';
import type { BalancesType, BalanceType } from '#root/types/api-response';

// Fuel name mapping based on fuel IDs
const fuelNameMap: Record<number, string> = {
  14: 'АИ-92',
  15: 'АИ-95',
  19: 'АИ-95 PROF',
  21: 'АИ-100 PROF',
  17: 'ДТ',
  18: 'ГАЗ',
};

// Helper function to get fuel name
const getFuelName = (fuelId: number) => {
  return fuelNameMap[fuelId] || `Fuel ${fuelId}`;
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
    valueFormatter: (value: number) => Number(value.toFixed(2)),
    renderCell: (parameters) => formatNumberWithSpaces(parameters.value),
  },
  {
    field: 'spent',
    headerName: 'Расход',
    display: 'flex',
    align: 'left',
    headerAlign: 'left',
    type: 'number',
    valueFormatter: (value: number) => Number(value.toFixed(2)),
    renderCell: (parameters) => formatNumberWithSpaces(parameters.value),
  },
  {
    field: 'canSpend',
    headerName: 'Можно потратить',
    display: 'flex',
    align: 'left',
    headerAlign: 'left',
    type: 'number',
    valueFormatter: (value: number) => Number(value.toFixed(2)),
    renderCell: (parameters) => formatNumberWithSpaces(parameters.value),
  },
  {
    field: 'moneyRemain',
    headerName: 'Сальдо расчетов',
    display: 'flex',
    align: 'left',
    headerAlign: 'left',
    type: 'number',
    valueFormatter: (value: number) => Number(value.toFixed(2)),
    renderCell: (parameters) => formatNumberWithSpaces(parameters.value),
  },
  {
    field: 'fuelRemain',
    headerName: 'Остатки',
    display: 'flex',
    align: 'left',
    headerAlign: 'left',
    type: 'string',
    width: 300,
    renderCell: (parameters) => {
      const balances = parameters.value;
      if (!balances || typeof balances !== 'object') return '-';

      const fuelList = Object.values(balances as BalancesType)
        .flatMap((balance) => Object.values(balance))
        .map((balanceInfo: BalanceType) => {
          const fuelName = getFuelName(balanceInfo.fuelId);
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
            return `<b>${fuelName}${pcc}</b> ${liters.toFixed(2)}л. ${rubles.toFixed(2)}руб.`;
          }
          if (overdraftLiters < -0.01) {
            return `<b>${fuelName}${pcc}</b> -${Math.abs(overdraftLiters).toFixed(2)}л. -${Math.abs(Number.parseFloat(balanceInfo.overdraftRubles)).toFixed(2)}руб.`;
          }
        })
        .filter(Boolean);

      return fuelList.length > 0 ? (
        <div dangerouslySetInnerHTML={{ __html: fuelList.join('<br>') }} />
      ) : (
        '-'
      );
    },
  },
];

export default ContractColumns;
