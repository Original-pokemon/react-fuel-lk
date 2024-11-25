import { createContext, Dispatch, SetStateAction } from 'react';
import type { SelectedFiltersType } from './Filter';

const FilterContext = createContext<{
  selectedFilters: SelectedFiltersType;
  setSelectedFilters: Dispatch<SetStateAction<SelectedFiltersType>>;
} | null>(null);

export default FilterContext;
