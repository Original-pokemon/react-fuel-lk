import { Paper, PaperProps, styled } from '@mui/material';

export const WalletTypeBoxStyled = styled(Paper)<
  PaperProps & { backgroundColor: string }
>(({ theme, backgroundColor }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  maxWidth: 'fit-content',
  padding: ['0.2rem', '0.4rem'],

  fontSize: '0.8rem',
  color: theme.palette.text.secondary,

  border: `2px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor,
}));
