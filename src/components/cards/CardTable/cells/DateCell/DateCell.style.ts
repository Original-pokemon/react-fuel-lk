import { PaperProps, Paper, styled } from '@mui/material';

export const DateCellPaperStyled = styled(Paper)<
  PaperProps & { backgroundColor?: string; flexDirection?: 'row' | 'column' }
>(({ theme, backgroundColor, flexDirection }) => ({
  display: 'flex',
  flexDirection: flexDirection || 'column', // Динамическое направление
  justifyContent: 'center',
  alignItems: flexDirection === 'row' ? 'center' : 'flex-start', // Меняем выравнивание

  height: '3.8em',
  maxWidth: 'fit-content',
  padding: '0.4em',

  fontSize: '0.875rem',
  color: theme.palette.text.primary,
  backgroundColor,
  borderRadius: theme.shape.borderRadius,
}));
