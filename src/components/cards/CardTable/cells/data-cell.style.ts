import { Container, ContainerProps, styled } from '@mui/material';

export const DataCellBoxStyled = styled(Container)<ContainerProps>(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
}));
