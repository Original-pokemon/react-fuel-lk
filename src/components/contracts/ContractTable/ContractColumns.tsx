import { GridColDef } from '@mui/x-data-grid';

const ContractColumns: GridColDef[] = [
  {
    field: 'code',
    headerName: 'Номер договора',
    display: 'flex',
    align: 'center',
    type: 'string',
    hideable: false,
  },
  {
    field: 'fuelname',
    headerName: 'Тип цен',
    display: 'flex',
    align: 'center',
    type: 'string',
  },
  {
    field: 'dsumma',
    headerName: 'Сумма договора',
    display: 'flex',
    align: 'center',
    type: 'number',
    valueFormatter: (value: number) => value.toFixed(2),
  },
  {
    field: 'spent',
    headerName: 'Расход',
    display: 'flex',
    align: 'center',
    type: 'number',
    valueFormatter: (value: number) => value.toFixed(2),
  },
  {
    field: 'canSpend',
    headerName: 'Можно потратить',
    display: 'flex',
    align: 'center',
    type: 'number',
    valueFormatter: (value: number) => value.toFixed(2),
  },
  {
    field: 'moneyRemain',
    headerName: 'Остаток по деньгам',
    display: 'flex',
    align: 'center',
    type: 'number',
    valueFormatter: (value: number) => value.toFixed(2),
  },
  {
    field: 'fuelRemain',
    headerName: 'Остаток по топливу',
    display: 'flex',
    align: 'center',
    type: 'number',
    valueFormatter: (value: number) => value.toFixed(2),
  },
];

export default ContractColumns;
