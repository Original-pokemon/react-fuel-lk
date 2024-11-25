import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import { NameSpace, Status } from '#root/const';
import { generateMockNomenclature } from '#root/mock/nomenclature';
import { generateMockCardTransactionList } from '#root/mock/card-transaction';
import Transitions from './Transactions';

const mockStore = configureMockStore();

const transaction = generateMockCardTransactionList(100);

const transactionEntities = Object.entries(transaction).map(([key, value]) => ({
  id: key,
  ...value,
}));

const initialState = {
  [NameSpace.App]: {
    nomenclature: generateMockNomenclature(),
  },
  [NameSpace.Transaction]: {
    ids: [...Array.from({ length: 100 }).keys()],
    status: Status.Success,
    entities: transactionEntities,
  },
  [NameSpace.Firm]: {
    status: Status.Success,
  },
};

type TransactionPageType = typeof Transitions;

const store = mockStore(initialState);

const meta: Meta<TransactionPageType> = {
  title: 'Transactions',
  component: Transitions,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </Provider>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<TransactionPageType>;

export const Default: Story = {
  args: {},
};
