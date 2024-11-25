import { Box, BoxProps, styled } from '@mui/material';

export const ProgressBarFill = styled(Box)<BoxProps>(({ theme }) => ({
  height: '100%',
  '&.low': {
    backgroundColor: theme.palette.secondary.dark,
  },
  '&.medium': {
    backgroundColor: theme.palette.secondary.light,
  },
  '&.high': {
    backgroundColor: '#088208a3',
  },
}));
