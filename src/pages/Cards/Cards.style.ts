import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, BoxProps } from '@mui/material';

const buttonStyle = css({
  padding: '5px',
  cursor: 'pointer',
});

const CardsStyledBox = styled(Box)<BoxProps>(() => ({
  alignItems: 'center',
  gap: '20px',
  marginBottom: '20px',

  button: buttonStyle,
}));

export default CardsStyledBox;
