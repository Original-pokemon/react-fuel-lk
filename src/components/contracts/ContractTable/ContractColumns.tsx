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
    renderCell: (parameters) => {
      const balances = parameters.value;
      if (!balances || typeof balances !== 'object') return '-';

      let fs = '';
      let os = '';

      Object.values(balances as BalancesType).forEach((balance) => {
        Object.values(balance).forEach((balanceInfo: BalanceType) => {
          const pcc =
            parameters.row.priceType === 33
              ? `[${balanceInfo.initialPrice}]`
              : '';
          if (Number.parseFloat(balanceInfo.canSpendLitersWithCredit) > 0.01) {
            const fuelName = getFuelName(balanceInfo.fuelId);
            fs += `<b>${fuelName}${pcc}</b>&nbsp;${formatNumberWithSpaces(Number.parseFloat(balanceInfo.canSpendLitersWithCredit))}л.&nbsp;${formatNumberWithSpaces(Number.parseFloat(balanceInfo.canSpendRublesWithCredit))}руб.<br>`;
          }
          if (Number.parseFloat(balanceInfo.overdraftLiters) < 0.01) {
            if (os === '') os = 'Перерасход:<br>';
            const fuelName = getFuelName(balanceInfo.fuelId);
            os += `<b>${fuelName}${pcc}</b>&nbsp;${formatNumberWithSpaces(Number.parseFloat(balanceInfo.overdraftLiters))}л.&nbsp;${formatNumberWithSpaces(Number.parseFloat(balanceInfo.overdraftRubles))}руб.<br>`;
          }
        });
      });

      const result = fs + os;
      return result ? (
        <div dangerouslySetInnerHTML={{ __html: result }} />
      ) : (
        '-'
      );
    },
  },
];

export default ContractColumns;
