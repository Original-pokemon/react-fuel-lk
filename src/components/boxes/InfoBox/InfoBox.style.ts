import { Box, BoxProps, styled } from '@mui/material';

const InfoStyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  maxWidth: '30rem',
  minHeight: '15rem',
  padding: '2rem',
  borderRadius: '10px',
  backgroundColor: theme.palette.background.paper,

  h1: {
    marginBottom: '20px',

    [theme.breakpoints.values.xl]: {
      fontSize: '24px',
    },
  },

  '.list': {
    '.listItem': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '30px',

      '.name': {
        fontSize: '16px',
        fontWeight: 500,
      },

      '.values': {
        fontSize: '14px',
      },

      '.amount': {
        fontWeight: 500,
      },
    },
  },
}));

export default InfoStyledBox;
