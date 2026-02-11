import DataTable from '#root/components/layouts/data-layouts/DataTable/DataTable';
import { GridColDef } from '@mui/x-data-grid';

type DataItem = {
  label: string;
  value?: string | number;
  description?: string;
};

type DataListTableProperties = {
  items: DataItem[];
  title?: string; // Если нужен заголовок
};

function DataListTable({ items, title }: DataListTableProperties) {
  // Определяем колонки для таблицы
  const columns: GridColDef[] = [
    {
      field: 'label',
      headerName: 'Наименование',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'value',
      headerName: 'Значение',
      flex: 1,
      minWidth: 100,
      // Если у некоторых элементов нет value, но есть description — можно
      // отображать description или оставитpь пустым.
      valueGetter: (value: string) => value ?? '',
    },
  ];

  // Генерируем строки: у DataGrid должны быть уникальные `id` для каждой строки.
  const rows = items.map((item, index) => ({
    id: index, // или уникальный id, если есть
    label: item.label,
    value: item.value ?? item.description,
  }));

  return (
    <div style={{ height: 300 }}>
      <DataTable
        rows={rows}
        columns={columns}
        loading={false}
        name={title}
        disableFooter
        disableToolBar
        disableHeaders
        disableColumnFilter
      />
    </div>
  );
}

export default DataListTable;
