import type { Meta, StoryObj } from '@storybook/react';
import WalletTypeCell from './wallet-type-cell';

type WalletTypeCellType = typeof WalletTypeCell;

const meta: Meta<WalletTypeCellType> = {
  title: 'Cards/CardsTable/Cells/WalletTypeCell',
  component: WalletTypeCell,
  render: (arguments_) => <WalletTypeCell {...arguments_} />,
};
export default meta;

type Story = StoryObj<WalletTypeCellType>;

export const FuelCard: Story = {
  args: {
    value: 1,
  },
};
export const ServiceCard: Story = {
  args: {
    value: 2,
  },
};
export const CombinedCard: Story = {
  args: {
    value: 3,
  },
};
