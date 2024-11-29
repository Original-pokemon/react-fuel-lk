import { Paper, PaperProps, styled } from '@mui/material';

const ProgressBarContainer = styled(Paper)<PaperProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',

  minWidth: '100px',
  maxWidth: '120px',
  height: '2.5rem',
  margin: '0.2em',

  border: `2px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.wborderRadius,
  backgroundColor: theme.palette.background.default,
}));

export default ProgressBarContainer;
