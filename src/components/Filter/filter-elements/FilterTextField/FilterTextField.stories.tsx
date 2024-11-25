import { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import FilterTextField from './filter-text-field';
import { FilterContext } from '../../context';
import { SelectedFiltersType } from '../../filter';

type FilterTextFieldType = typeof FilterTextField;

const meta: Meta<FilterTextFieldType> = {
  title: 'Components/Filter/FilterTextField',
  component: FilterTextField,
  decorators: [
    (Story) => {
      const [selectedFilters, setSelectedFilters] =
        useState<SelectedFiltersType>({});

      const value = useMemo(
        () => ({ selectedFilters, setSelectedFilters }),
        [selectedFilters, setSelectedFilters],
      );

      return (
        <FilterContext.Provider value={value}>
          <Story />
        </FilterContext.Provider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<FilterTextFieldType>;

export const Default: Story = {
  args: {
    id: 'cardNumber',
    title: 'Номер карты',
    defaultValue: '',
  },
};
