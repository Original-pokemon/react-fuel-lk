import type { Meta, StoryObj } from '@storybook/react';
import { DateCell } from './date-cell';

type DateCellType = typeof DateCell;

const meta: Meta<DateCellType> = {
  title: 'Cards/CardsTable/Cells/DateCell',
  component: DateCell,
  render: (arguments_) => <DateCell {...arguments_} />,
};
export default meta;

type Story = StoryObj<DateCellType>;

export const LastOperationDate: Story = {
  args: {
    value: '2024-09-20',
  },
};
