import { Meta, StoryObj } from '@storybook/react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { NameSpace, Status } from '#root/const';
import { generateMockFuelCardList } from '#root/mock/fuel-card';
import CardsTable from './cards-table';

type CardsTableType = typeof CardsTable;

const mockStore = configureMockStore();

const cards = generateMockFuelCardList(100);
const cardsEntities = cards.entries();

const initialState = {
  [NameSpace.Firm]: {
    cards: {
      ids: [...cards.keys()],
      entities: Object.fromEntries(cardsEntities),
    },
    status: Status.Success,
  },
};

const store = mockStore(initialState);

const meta: Meta<CardsTableType> = {
  title: 'Cards/CardsTable',
  component: CardsTable,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Provider store={store}>
          <Story />
        </Provider>
      </BrowserRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<CardsTableType>;

export const Default: Story = {};
