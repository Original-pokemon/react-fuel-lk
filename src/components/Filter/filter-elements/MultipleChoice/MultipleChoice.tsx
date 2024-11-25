import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  Typography,
} from '@mui/material';
import { memo } from 'react';
import type { FilterType } from '../../Filter';
import { useFilterContext } from '../../hooks';

const MultipleChoice = memo(({ id, title, options }: FilterType) => {
  const { selectedFilters, setSelectedFilters } = useFilterContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    const isSelected = event.target.checked;

    const selectedOption = options.find(
      (option) => option.value === selectedValue,
    );

    if (selectedOption) {
      let selected = selectedFilters[id]?.options || [];

      selected = isSelected
        ? [...selected, selectedOption]
        : selected.filter((option) => option.value !== selectedValue);

      if (selected.length > 0) {
        setSelectedFilters((previous) => ({
          ...previous,
          [id]: { title, options: selected },
        }));
      } else {
        setSelectedFilters((previous) => {
          const updatedFilters = { ...previous };
          delete updatedFilters[id];
          return updatedFilters;
        });
      }
    }
  };

  const selectedOptions = selectedFilters[id]?.options || [];
  const selectedValuesSet = new Set(
    selectedOptions.map((option) => option.value),
  );

  return (
    <FormControl id={id} sx={{ p: 2 }}>
      <Typography variant="subtitle1">{title}</Typography>
      <FormGroup>
        {options.map(({ label, value }) => (
          <FormControlLabel
            key={value}
            value={value}
            control={
              <Checkbox
                checked={selectedValuesSet.has(value)}
                onChange={handleChange}
              />
            }
            label={label}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
});

export type MultipleChoiceType = ReturnType<typeof MultipleChoice>;

export default MultipleChoice;
