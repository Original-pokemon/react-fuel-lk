import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { generateMockCardTransactionList } from '#root/mock/card-transaction';
import { NameSpace } from '#root/const';
import { generateMockNomenclature } from '#root/mock/nomenclature';
import TransactionsTable from './transactions-table';

type TransactionsTableType = typeof TransactionsTable;

const transactions = generateMockCardTransactionList(100);

const mockStore = configureMockStore();

const initialState = {
  [NameSpace.App]: {
    nomenclature: generateMockNomenclature(),
  },
};

const store = mockStore(initialState);

const meta: Meta<TransactionsTableType> = {
  title: 'Transactions/TransactionsTable',
  component: TransactionsTable,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<TransactionsTableType>;

export const Default: Story = {
  args: {
    name: 'Sample Transactions',
    transactions,
  },
};

export const Loading: Story = {
  args: {
    name: 'Loading Transactions',
    transactions: [],
    isLoading: true,
  },
};
