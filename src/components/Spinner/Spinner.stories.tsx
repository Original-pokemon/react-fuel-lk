import { Meta, StoryObj } from '@storybook/react';
import Spinner from './Spinner';

export default {
  component: Spinner,
} as Meta<typeof Spinner>;

type Story = StoryObj<typeof Spinner>;

export const DefaultSpinner: Story = {
  args: {
    size: 40,
  },
};

export const FullScreen: Story = {
  name: 'Full screen spinner',
  args: {
    fullscreen: true,
    size: 100,
  },
};
