import { Box, BoxProps, styled } from '@mui/material';

export const FooterStyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  flex: '0 0 auto',
  display: 'flex',
  height: '12vh',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '30px',
  backgroundColor: theme.palette.primary.main,

  span: {
    '&:first-of-type': {
      fontWeight: 'bold',
    },
    '&:last-of-type': {
      fontSize: '14px',
    },
  },
}));
