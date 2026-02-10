import type { FilterOption } from '.';

export type FilterSectionType = {
  id: string;
  title: string;
  options: FilterOption[];
  defaultValue?: string | string[];
};
