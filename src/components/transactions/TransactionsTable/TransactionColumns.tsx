import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { green, red } from '@mui/material/colors';
import FuelChip from '../../FuelChip/FuelChip';

const FuelName = {
  14: 'АИ-92',
  15: 'АИ-95',
  19: 'АИ-95 PROF',
  21: 'АИ-100 PROF',
  17: 'ДТ',
  18: 'ГАЗ',
};

const transactionColumns: GridColDef[] = [
  {
    field: 'dt',
    headerName: 'Дата и время',
    width: 170,
  },
  { field: 'cardnum', headerName: 'Номер карты', width: 130 },
  {
    field: 'summa',
    headerName: 'Сумма',
    width: 100,
    valueFormatter: (value: string) =>
      Number(value).toFixed(2).replace('.', ',').replace('-', ''),
    renderCell: (parameters: GridRenderCellParams) => (
      <span style={{ color: parameters.row.op === -1 ? red[500] : green[500] }}>
        {parameters.value}
      </span>
    ),
  },
  {
    field: 'volume',
    headerName: 'Объем',
    width: 100,
    valueFormatter: (value: string) =>
      Number(value).toFixed(2).replace('.', ','),
  },
  {
    field: 'fuelid',
    headerName: 'Топливо',
    width: 150,
    valueFormatter: (value) => FuelName[value] ?? 'Неизвестное топливо',
    renderCell: (parameters: GridRenderCellParams) => (
      <FuelChip fuelId={parameters.value} />
    ),
  },
  {
    field: 'price',
    headerName: 'Цена',
    width: 100,
    valueFormatter: (value: string) =>
      Number(value).toFixed(2).replace('.', ','),
  },
  {
    field: 'op',
    headerName: 'Тип операции',
    width: 150,
    valueFormatter: (value) => (value === -1 ? 'Списание' : 'Пополнение'),
    renderCell: (parameters: GridRenderCellParams) => (
      <span style={{ color: parameters.row.op === -1 ? red[500] : green[500] }}>
        {parameters.value === -1 ? 'Списание' : 'Пополнение'}
      </span>
    ),
  },
  { field: 'azs', headerName: 'АЗС', width: 100 },
];

export default transactionColumns;
