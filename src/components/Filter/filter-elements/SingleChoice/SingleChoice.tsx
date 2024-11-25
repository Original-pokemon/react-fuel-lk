import {
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  Typography,
} from '@mui/material';
import React, { memo } from 'react';
import type { FilterType } from '../../Filter';
import { useFilterContext } from '../../hooks';

type SingleChoiceComponentProperties = FilterType & {
  defaultValue: string;
};

const SingleChoice = memo(
  ({ id, title, options, defaultValue }: SingleChoiceComponentProperties) => {
    const { selectedFilters, setSelectedFilters } = useFilterContext();
    const selected = selectedFilters[id]?.options[0]?.value || defaultValue;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedValue = (event.target as HTMLInputElement).value;
      const selectedOption = options.find(
        (option) => option.value === selectedValue,
      );

      if (selectedOption) {
        setSelectedFilters((previous) => ({
          ...previous,
          [id]: {
            title,
            options: [
              { label: selectedOption.label, value: selectedOption.value },
            ],
          },
        }));
      }
    };

    return (
      <FormControl id={id} sx={{ p: 2 }}>
        <Typography variant="subtitle1">{title}</Typography>
        <RadioGroup value={selected} onChange={handleChange}>
          {options.map(({ label, value }) => (
            <FormControlLabel
              key={value}
              value={value}
              control={<Radio />}
              label={label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    );
  },
);

export type SingleChoiceType = ReturnType<typeof SingleChoice>;

export default SingleChoice;
