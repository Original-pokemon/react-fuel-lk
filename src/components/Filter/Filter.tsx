import { useMemo, useRef, useState } from 'react';
import { Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import AppliedFilters from './AppliedFilters/AppliedFilters';
import FilterContent from './FilterContent/FilterContent';
import type { FilterElementsType } from './FilterContent/FilterContent';
import MultipleChoice from './filter-elements/MultipleChoice/MultipleChoice';
import SingleChoice from './filter-elements/SingleChoice/SingleChoice';
import FilterTextField from './filter-elements/FilterTextField/FilterTextField';
import FilterContext from './context';
import useEffectSkipMount from './hooks';

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterType = {
  id: string;
  title: string;
  options: FilterOption[];
};

export type SelectedFiltersType = {
  [key: FilterType['id']]: Omit<FilterType, 'id'>;
};

type FilterProperties = {
  children: FilterElementsType[];
  onChange: ({ key, value }: SelectedFiltersType) => void;
};

function Filter({ children, onChange }: FilterProperties) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFiltersType>(
    {},
  );
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const hasSelectedFilters = Object.keys(selectedFilters).length > 0;

  const handleDrawerOpen = () => setDrawerOpen(true);

  const handleDrawerClose = () => setDrawerOpen(false);

  useEffectSkipMount(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      onChange(selectedFilters);
    }, 300);
  }, [selectedFilters]);

  const value = useMemo(
    () => ({ selectedFilters, setSelectedFilters }),
    [selectedFilters, setSelectedFilters],
  );

  return (
    <FilterContext.Provider value={value}>
      {/* Кнопка для открытия фильтров */}
      <Button
        variant={hasSelectedFilters ? 'contained' : 'outlined'}
        startIcon={<FilterListIcon />}
        size="small"
        onClick={handleDrawerOpen}
        aria-label="Фильтры"
      >
        {`Фильтры${hasSelectedFilters ? ` (${Object.keys(selectedFilters).length})` : ''}`}
      </Button>

      {/* Выдвижная панель с фильтрами */}
      <FilterContent open={drawerOpen} onClose={handleDrawerClose}>
        {children}
      </FilterContent>

      {/* Отображение выбранных фильтров */}
      <AppliedFilters />
    </FilterContext.Provider>
  );
}

Filter.SingleChoice = SingleChoice;
Filter.MultipleChoice = MultipleChoice;
Filter.FilterTextField = FilterTextField;

export default Filter;
