import { GridColDef } from '@mui/x-data-grid';
import CardDetailsButton from './cells/CardDetailsButton/CardDetailsButton';
import LimitCell from './cells/LimitCell/LimitCell';
import StatusCell from './cells/StatusCell/StatusCell';
import SostCell from './cells/SostCell/SostCell';
import WalletTypeCell from './cells/WalletTypeCell/WalletTypeCell';
import { DateCell } from './cells/DateCell/DateCell';

const CardsColumns: GridColDef[] = [
  {
    field: 'cardnum',
    headerName: 'Номер карты',
    display: 'flex',
    align: 'center',
    type: 'string',
    hideable: false,
  },
  {
    field: 'cardowner',
    headerName: 'Владелец карты',
    type: 'string',
    display: 'flex',
    align: 'center',
    valueFormatter: (value: string) => value.trim() || 'Не указано',
  },
  {
    field: 'wallettype',
    headerName: 'Тип карты',
    display: 'flex',
    align: 'center',
    type: 'custom',
    renderCell: (parameters) => <WalletTypeCell value={parameters.value} />,
  },
  {
    field: 'blocked',
    headerName: 'Статус',
    display: 'flex',
    align: 'center',
    type: 'custom',
    renderCell: (parameters) => <StatusCell value={parameters.value} />,
  },
  {
    field: 'sost',
    headerName: 'Состояние',
    display: 'flex',
    align: 'center',
    type: 'custom',
    renderCell: (parameters) => <SostCell value={parameters.value} />,
  },
  {
    field: 'dayLimitInfo',
    headerName: 'Дневной лимит',
    sortable: false,
    display: 'flex',
    align: 'center',
    type: 'custom',
    valueFormatter: (_value, row) => `${row.dayremain} / ${row.daylimit}`,
    renderCell: ({ row }) => (
      <LimitCell limit={row.daylimit} remain={row.dayremain} />
    ),
  },
  {
    field: 'monthLimitInfo',
    headerName: 'Месячный лимит',
    sortable: false,
    display: 'flex',
    align: 'center',
    type: 'custom',
    valueFormatter: (_value, row) => `${row.monthremain} / ${row.monthlimit}`,
    renderCell: ({ row }) => (
      <LimitCell limit={row.monthlimit} remain={row.monthremain} />
    ),
  },
  {
    field: 'datelastop',
    headerName: 'Последняя операция',
    display: 'flex',
    align: 'center',
    type: 'custom',
    renderCell: (parameters) => (
      <DateCell variant="outlined" value={parameters.value} />
    ),
  },
  {
    field: 'details',
    type: 'actions',
    getActions: (parameters) => [
      <CardDetailsButton
        key={parameters.row.cardnum}
        cardnum={parameters.row.cardnum}
      />,
    ],
  },
];

export default CardsColumns;
