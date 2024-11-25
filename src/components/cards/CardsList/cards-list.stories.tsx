import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { generateMockFuelCardList } from '#root/mock/fuel-card';
import { CardsList } from './cards-list';

type CardsListType = typeof CardsList;

const cards = generateMockFuelCardList(100);

const meta: Meta<CardsListType> = {
  title: 'Cards/CardsList',
  component: CardsList,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<CardsListType>;

export const Default: Story = {
  args: {
    cards,
  },
};
