import { Box, BoxProps, styled } from '@mui/material';

const ProgressBarValue = styled(Box)<BoxProps>(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  top: 0,
  bottom: 0,
  color: theme.palette.primary.dark,
  fontWeight: 'bold',
  fontSize: '0.875rem',

  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
  },
}));

export default ProgressBarValue;
