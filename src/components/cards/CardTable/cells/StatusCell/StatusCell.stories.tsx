import type { Meta, StoryObj } from '@storybook/react';
import StatusCell from './status-cell';

type StatusCellCellType = typeof StatusCell;

const meta: Meta<StatusCellCellType> = {
  title: 'Cards/CardsTable/Cells/StatusCell',
  component: StatusCell,
  render: (arguments_) => <StatusCell {...arguments_} />,
};
export default meta;

type Story = StoryObj<StatusCellCellType>;

export const ActiveCard: Story = {
  args: {
    value: false,
  },
};
export const BlockedCard: Story = {
  args: {
    value: true,
  },
};
