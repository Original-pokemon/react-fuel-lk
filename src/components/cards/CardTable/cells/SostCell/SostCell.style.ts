import { Paper, PaperProps, styled } from '@mui/material';

const SostCellStyled = styled(Paper)<PaperProps & { backgroundColor: string }>(
  ({ theme, backgroundColor }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    maxWidth: 'fit-content',
    padding: ['0.2rem', '0.4rem'],

    borderRadius: theme.shape.borderRadius,
    backgroundColor,
  }),
);

export default SostCellStyled;
