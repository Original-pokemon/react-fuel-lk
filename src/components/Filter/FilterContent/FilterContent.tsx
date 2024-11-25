import { Box } from '@mui/material';
import DataDrawer from '#root/components/layouts/data-layouts/DataDrawer/DataDrawer';
import type { MultipleChoiceType } from '../filter-elements/MultipleChoice/MultipleChoice';
import type { SingleChoiceType } from '../filter-elements/SingleChoice/SingleChoice';
import type { FilterTextFieldType } from '../filter-elements/FilterTextField/FilterTextField';
import FilterHeaderActions from './FilterHeaderActions';
import { useFilterContext } from '../hooks';

export type FilterElementsType =
  | MultipleChoiceType
  | FilterTextFieldType
  | SingleChoiceType;

type FilterContentProperties = {
  open: boolean;
  onClose: () => void;
  children: FilterElementsType | FilterElementsType[];
};

function FilterContent({ children, open, onClose }: FilterContentProperties) {
  const { selectedFilters, setSelectedFilters } = useFilterContext();

  const handleClearTemporaryFilters = () => {
    setSelectedFilters({});
  };

  const hasTemporarySelectedFilters = Object.keys(selectedFilters).length > 0;

  return (
    <DataDrawer
      open={open}
      onClose={onClose}
      direction="left"
      maxSize="sm"
      sx={{ width: 320 }}
    >
      <DataDrawer.Header
        title="Фильтры"
        onClose={onClose}
        headerActions={
          <FilterHeaderActions
            hasTempSelectedFilters={hasTemporarySelectedFilters}
            onClearTempFilters={handleClearTemporaryFilters}
          />
        }
      />

      <DataDrawer.Body>
        <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>{children}</Box>
      </DataDrawer.Body>
    </DataDrawer>
  );
}

export default FilterContent;
