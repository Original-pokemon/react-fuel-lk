import { FormControl, Slider, Typography } from '@mui/material';
import type { onChange } from '@mui/types';
import React from 'react';
import Actions from '../../const';
import {
  useSelectedFiltersDispatch,
  useSelectedFiltersState,
} from '../../hooks';
import { FilterSectionType } from '../../types';

type SliderChoiceComponentProperties = Omit<FilterSectionType, 'options'> & {
  defaultValue: number;
  marks: { value: number; label: string }[];
  step: number;
};

function SliderChoice({
  id,
  title,
  defaultValue,
  marks,
  step,
}: SliderChoiceComponentProperties) {
  const selectedFilters = useSelectedFiltersState();
  const dispatch = useSelectedFiltersDispatch();

  const selected = selectedFilters[id]?.options[0]?.value || defaultValue;

  const handleChange: onChange = (
    _event: Event,
    selectedValue: number | number[],
  ) => {
    if (selectedValue) {
      dispatch({
        type: Actions.ADD_FILTER,
        payload: {
          id,
          filter: {
            title,
            options: [
              {
                label: `${selectedValue.toString()}%`,
                value: selectedValue.toString(),
              },
            ],
          },
        },
      });
    }
  };

  return (
    <FormControl id={id} sx={{ p: 2 }}>
      <Typography variant="subtitle1">{title}</Typography>
      <Typography variant="caption">{`Меньше: ${selected}%`}</Typography>
      <Slider
        aria-label="remaining fuel"
        defaultValue={+selected}
        valueLabelDisplay="auto"
        shiftStep={30}
        step={step}
        min={0}
        max={100}
        onChange={handleChange}
        marks={marks}
      />
    </FormControl>
  );
}

export type SliderChoiceType = ReturnType<typeof SliderChoice>;
export default React.memo(SliderChoice);
