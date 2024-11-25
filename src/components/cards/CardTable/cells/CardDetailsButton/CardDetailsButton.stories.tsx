import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CardDetailsButton from './card-detail-button';

type CardDetailsButtonType = typeof CardDetailsButton;

const meta: Meta<CardDetailsButtonType> = {
  title: 'Cards/CardsTable/Cells/CardDetailsButton',
  component: CardDetailsButton,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  render: (arguments_) => <CardDetailsButton {...arguments_} />,
};
export default meta;

type Story = StoryObj<CardDetailsButtonType>;

export const Default: Story = {
  args: {
    cardnum: 123_456,
  },
};
