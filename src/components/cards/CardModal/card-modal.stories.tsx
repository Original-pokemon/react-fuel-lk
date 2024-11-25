import { Meta, StoryFn } from '@storybook/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import { NameSpace } from '#root/const';
import { generateMockFuelCardData } from '#root/mock/fuel-card';
import type { CardType } from '#root/types';
import { generateMockNomenclature } from '#root/mock/nomenclature';
import CardModal from './CardModal';

const card: CardType = generateMockFuelCardData();

const mockStore = configureMockStore();

const initialState = {
  [NameSpace.App]: {
    nomenclature: generateMockNomenclature(),
  },
};

const store = mockStore(initialState);

const meta: Meta<typeof CardModal> = {
  title: 'Cards/CardModal',
  component: CardModal,
  decorators: [
    (Story) => {
      return (
        <Provider store={store}>
          <MemoryRouter>
            <Story />
          </MemoryRouter>
        </Provider>
      );
    },
  ],
};

export default meta;

const Template: StoryFn<{ card: CardType }> = () => <CardModal card={card} />;

export const Default = Template.bind({});
Default.args = {
  card,
};
