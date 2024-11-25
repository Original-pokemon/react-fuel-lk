import { GridToolbar, DataGridProps } from '@mui/x-data-grid';
import { dataGridClasses, DataGridStyled } from './DataTable.style';

type Properties = {
  name?: string;
  pageSizeOptions?: number[];
} & DataGridProps;

function DataTable({
  name,
  density = 'comfortable',
  columns,
  rows,
  filterModel,
  loading,
  pageSizeOptions = [10, 25, 50],
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
        toolbar: GridToolbar,
        // footer:
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
      // showColumnVerticalBorder
      // showCellVerticalBorder
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

export { DataTable };
