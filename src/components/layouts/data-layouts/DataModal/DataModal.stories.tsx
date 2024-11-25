import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Button, ThemeProvider, Typography } from '@mui/material';
import { theme } from '#root/styles/theme';
import DataModal from './DataModal';

const meta: Meta<typeof DataModal> = {
  title: 'DataView/DataModal',
  component: DataModal,
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DataModal>;

export const DefaultModal: Story = {
  render: (arguments_) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Открыть модальное окно
        </Button>
        <DataModal {...arguments_} open={open} onClose={() => setOpen(false)}>
          <Typography variant="body1">
            Это содержимое модального окна. Вы можете разместить здесь любой
            контент.
          </Typography>
        </DataModal>
      </>
    );
  },
  args: {
    title: 'Заголовок модального окна',
  },
};

export const FullscreenModal: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Открыть полноэкранное модальное окно
        </Button>
        <DataModal
          open={open}
          onClose={() => setOpen(false)}
          title="Полноэкранное модальное окно"
          fullScreen
        >
          <Typography variant="body1">
            Это полноэкранное модальное окно. Оно занимает весь экран.
          </Typography>
        </DataModal>
      </>
    );
  },
  args: {
    title: 'Полноэкранное модальное окно',
    fullScreen: true,
  },
};

export const ModalWithActions: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    const handleSave = () => {
      // Логика сохранения
      alert('Данные сохранены!');
      setOpen(false);
    };

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Открыть модальное окно с действиями
        </Button>
        <DataModal
          open={open}
          onClose={() => setOpen(false)}
          title="Модальное окно с действиями"
          actions={
            <>
              <Button onClick={() => setOpen(false)}>Отмена</Button>
              <Button variant="contained" onClick={handleSave}>
                Сохранить
              </Button>
            </>
          }
        >
          <Typography variant="body1">
            Это модальное окно содержит действия в нижней части.
          </Typography>
        </DataModal>
      </>
    );
  },
  args: {
    title: 'Модальное окно с действиями',
    actions: (
      <>
        <Button>Отмена</Button>
        <Button variant="contained">Сохранить</Button>
      </>
    ),
  },
};

export const ModalWithoutCloseButton: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Открыть модальное окно без кнопки закрытия
        </Button>
        <DataModal
          open={open}
          onClose={() => setOpen(false)}
          title="Модальное окно без кнопки закрытия"
          hideCloseButton
        >
          <Typography variant="body1">
            Это модальное окно без кнопки закрытия в заголовке.
          </Typography>
        </DataModal>
      </>
    );
  },
  args: {
    title: 'Модальное окно без кнопки закрытия',
    hideCloseButton: true,
  },
};

export const ModalWithCustomStyles: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Открыть модальное окно с кастомными стилями
        </Button>
        <DataModal
          open={open}
          onClose={() => setOpen(false)}
          title="Кастомное модальное окно"
          sx={{
            '& .MuiDialog-paper': {
              backgroundColor: 'secondary.light',
              borderRadius: 4,
            },
          }}
        >
          <Typography variant="body1">
            Это модальное окно с измененным стилем.
          </Typography>
        </DataModal>
      </>
    );
  },
  args: {
    title: 'Кастомное модальное окно',
    sx: {
      '& .MuiDialog-paper': {
        backgroundColor: 'secondary.light',
        borderRadius: 4,
      },
    },
  },
};

export const ModalWithLongContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    const longText = Array.from(
      { length: 50 },
      (_, index) => `Строка контента ${index + 1}`,
    ).join('\n');

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Открыть модальное окно с длинным контентом
        </Button>
        <DataModal
          open={open}
          onClose={() => setOpen(false)}
          title="Модальное окно с длинным контентом"
        >
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            {longText}
          </Typography>
        </DataModal>
      </>
    );
  },
  args: {
    title: 'Модальное окно с длинным контентом',
  },
};
