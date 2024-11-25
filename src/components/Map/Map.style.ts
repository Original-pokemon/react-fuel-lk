/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import theme from '#root/styles/theme';

const topBoxStyle = css({
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

      '.fuelType': {
        display: 'flex',
        gap: '20px',

        img: {
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          objectFit: 'cover',

          [theme.breakpoints.values.xl]: {
            display: 'none',
          },

          [theme.breakpoints.values.lg]: {
            display: 'block',
          },
        },

        '.fuelData': {
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',

          '.username': {
            fontSize: '14px',
            fontWeight: 500,
          },

          '.email': {
            fontSize: '12px',

            [theme.breakpoints.values.xl]: {
              display: 'none',
            },

            [theme.breakpoints.values.lg]: {
              display: 'block',
            },
          },
        },
      },

      '.amount': {
        fontWeight: 500,
      },
    },
  },
});

export default topBoxStyle;
