import { css } from '@emotion/react';
import theme from '#root/styles/theme';

const MainMenuStyle = css({
  '.item': {
    display: 'flex',
    flexDirection: 'column',

    '.title': {
      fontSize: '16px',
      fontWeight: 600,
      color: theme.palette.text.primary,
      textTransform: 'uppercase',

      [theme.breakpoints.values.lg]: {
        display: 'none',
      },
    },

    '.listItem': {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      borderRadius: '5px',
      backgroundColor: theme.palette.background.paper,

      '&.active': {
        backgroundColor: theme.palette.background.default,
      },

      '&:hover': {
        backgroundColor: theme.palette.background.default,
      },

      '.listItemTitle': {
        [theme.breakpoints.values.lg]: {
          display: 'none',
        },
      },
    },
  },
});

export default MainMenuStyle;
