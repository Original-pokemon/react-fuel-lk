import { GridToolbar, DataGridProps } from '@mui/x-data-grid';
import { dataGridClasses, DataGridStyled } from './DataTable.style';

type Properties = {
  name?: string;
  pageSizeOptions?: number[];
  disableToolBar?: boolean;
  disableFooter?: boolean;
  disableHeaders?: boolean;
} & DataGridProps;

function DataTable({
  name,
  density = 'comfortable',
  columns,
  rows,
  filterModel,
  loading,
  pageSizeOptions = [10, 25, 50],
  disableToolBar = false,
  disableFooter = false,
  disableHeaders = false,
  ...rest
}: Properties) {
  return (
    <DataGridStyled
      rows={rows}
      columns={[...columns]}
      filterModel={filterModel}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: pageSizeOptions[0],
          },
        },
      }}
      density={density}
      slots={{
        columnHeaders: disableHeaders ? () => null : undefined,
        toolbar: disableToolBar ? null : GridToolbar,
        footer: disableFooter ? () => null : undefined,
      }}
      slotProps={{
        toolbar: {
          printOptions: { disableToolbarButton: true },
          csvOptions: {
            fileName: name,
            delimiter: ';',
            utf8WithBom: true,
          },
        },
      }}
      pageSizeOptions={pageSizeOptions}
      loading={loading}
      autosizeOptions={{
        expand: true,
        includeHeaders: false,
        includeOutliers: true,
      }}
      autosizeOnMount
      classes={{
        columnHeaderTitle: dataGridClasses.wrapHeader,
      }}
      disableRowSelectionOnClick
      disableDensitySelector
      disableColumnFilter
      disableColumnSorting
      disableColumnMenu
      disableVirtualization
      {...rest}
    />
  );
}

export default DataTable;
