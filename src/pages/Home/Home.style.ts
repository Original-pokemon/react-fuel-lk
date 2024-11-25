import { Box, BoxProps, styled } from '@mui/material';

const HomeStyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'grid',
  gap: '1.125rem',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gridAutoRows: 'minmax(11.25rem, auto)',
  gridAutoFlow: 'dense',

  [theme.breakpoints.values.xl]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  [theme.breakpoints.values.lg]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.values.md]: {
    gridTemplateColumns: 'repeat(1, 1fr)',
  },
  [theme.breakpoints.values.sm]: {
    gridAutoRows: 'minmax(7.5rem, auto)',
  },

  '.box': {
    borderRadius: '0.625rem',
    border: ['0.125rem', 'solid', theme.palette.background.default],

    [theme.breakpoints.values.md]: {
      maxWidth: '26rem',
    },
  },

  '.box1': {
    gridColumn: 'span 1',
    gridRow: 'span 2',
  },

  '.box2': {
    gridColumn: 'span 1',
    gridRow: 'span 2',
  },

  '.box4': {
    gridColumn: 'span 1',
    gridRow: 'span 3',
  },

  '.box7': {
    backgroundColor: theme.palette.background.default,
    borderRadius: '0.625rem',
    gridColumn: 'span 2',
    gridRow: 'span 2',
    padding: '1.25rem',

    [theme.breakpoints.values.md]: {
      display: 'none',
    },
  },
}));

export default HomeStyledBox;
