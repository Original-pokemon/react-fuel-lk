import type { Meta, StoryObj } from '@storybook/react';
import { LimitCell } from './limit-cell';

type LimitCellType = typeof LimitCell;

const meta: Meta<LimitCellType> = {
  title: 'Cards/CardsTable/Cells/LimitCell',
  component: LimitCell,
  render: (arguments_) => <LimitCell {...arguments_} />,
};
export default meta;

type Story = StoryObj<LimitCellType>;

export const DayLimit: Story = {
  args: {
    limit: 1000,
    remain: 500,
  },
};
export const MonthLimit: Story = {
  args: {
    limit: 10_000,
    remain: 3000,
  },
};
