import { Meta, StoryObj } from '@storybook/react';
import SingleChoice from './single-choice';

type SingleChoiceType = typeof SingleChoice;

const meta: Meta<SingleChoiceType> = {
  title: 'Components/Filter/SingleChoice',
  component: SingleChoice,
};

export default meta;

type Story = StoryObj<SingleChoiceType>;

export const Default: Story = {
  args: {
    title: 'Тип операции',
    options: [
      { label: 'Все', value: 'all' },
      { label: 'Списание', value: '-1' },
      { label: 'Пополнение', value: '1' },
    ],
  },
};
