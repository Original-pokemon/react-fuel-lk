import { Meta, StoryObj } from '@storybook/react';
import MultipleChoice from './muliple-choice';

type MultipleChoice = typeof MultipleChoice;

const meta: Meta<MultipleChoice> = {
  title: 'Components/Filter/MultipleChoice',
  component: MultipleChoice,
};

export default meta;

type Story = StoryObj<MultipleChoice>;

export const Default: Story = {
  args: {
    title: 'Топливо',
    options: [
      { label: 'АИ-92', value: '1' },
      { label: 'АИ-95', value: '2' },
      { label: 'АИ-98', value: '3' },
      { label: 'ДТ', value: '4' },
      { label: 'Газ', value: '5' },
    ],
  },
};
