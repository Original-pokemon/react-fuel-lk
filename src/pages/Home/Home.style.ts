import { Box, BoxProps, styled } from '@mui/material';

const HomeStyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  gridTemplateColumns: 'repeat(4, 1fr)',
  gridAutoRows: 'minmax(11.25rem, auto)',
  gridAutoFlow: 'dense',

  // Для экранов шириной меньше чем 'xl' (1920px)
  [theme.breakpoints.down('xl')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  // Для экранов шириной меньше чем 'lg' (1200px)
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  // Для экранов шириной меньше чем 'md' (900px)
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },

  '.box': {
    gridColumn: 'span 1',
    gridRow: 'span 1',

    borderRadius: '0.625rem',
    border: `0.125rem solid ${theme.palette.background.default}`,
    backgroundColor: theme.palette.background.paper,

    [theme.breakpoints.down('lg')]: {
      gridColumn: 'span 1',
    },
    [theme.breakpoints.down('md')]: {
      gridColumn: 'span 1',
    },
  },

  '.box7': {
    backgroundColor: theme.palette.background.default,
    borderRadius: '0.625rem',
    padding: theme.spacing(2),
    cursor: 'pointer',

    [theme.breakpoints.down('lg')]: {
      gridColumn: 'span 2',
      gridRow: 'span 2',
    },

    [theme.breakpoints.down('md')]: {
      gridColumn: 'span 1',
      gridRow: 'span 2',
    },
  },
}));

export default HomeStyledBox;
