import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { green, red } from '@mui/material/colors';
import FuelChip from '../../FuelChip/FuelChip';

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
    renderCell: (parameters: GridRenderCellParams) => (
      <span style={{ color: parameters.row.op === -1 ? red[500] : green[500] }}>
        {parameters.value}
      </span>
    ),
  },
  { field: 'volume', headerName: 'Объем', width: 100 },
  {
    field: 'fuelid',
    headerName: 'Топливо',
    width: 150,
    renderCell: (parameters: GridRenderCellParams) => (
      <FuelChip fuelId={parameters.value} />
    ),
  },
  { field: 'price', headerName: 'Цена', width: 100 },
  {
    field: 'op',
    headerName: 'Тип операции',
    width: 150,
    renderCell: (parameters: GridRenderCellParams) => (
      <span style={{ color: parameters.row.op === -1 ? red[500] : green[500] }}>
        {parameters.value === -1 ? 'Списание' : 'Пополнение'}
      </span>
    ),
  },
  { field: 'azs', headerName: 'АЗС', width: 100 },
];

export default transactionColumns;
