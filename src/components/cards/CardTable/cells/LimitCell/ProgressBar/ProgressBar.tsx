import React from 'react';
import { PaperProps } from '@mui/material';
import clsx from 'clsx';
import ProgressBarValue from './ProgressBarValue.style';
import { ProgressBarFill } from './ProgressBarFill.style';
import { ProgressBarContainer } from './ProgressBar.style';

type ProgressBarProperties = {
  value: number; // Значение прогресса от 0 до 1
  label: string;
} & PaperProps;

const ProgressBar = React.memo(function ProgressBar(
  properties: ProgressBarProperties,
) {
  const { value, label, ...rest } = properties;
  const valueInPercent = Math.round(value * 100);

  return (
    <ProgressBarContainer variant="outlined" {...rest}>
      <ProgressBarFill
        className={clsx({
          low: valueInPercent <= 30,
          medium: valueInPercent > 30 && valueInPercent <= 70,
          high: valueInPercent > 70,
        })}
        style={{ width: `${valueInPercent}%` }}
      />
      <ProgressBarValue>{label}</ProgressBarValue>
    </ProgressBarContainer>
  );
});

export { ProgressBar };
