import React from 'react';
import { Box, Typography } from '@mui/material';

type KPIBoxProperties = {
  label: string;
  value: string | number;
  variant?: 'primary' | 'secondary' | 'success' | 'error'; // для цветового кодирования
};

function KPIBox({ label, value, variant = 'primary' }: KPIBoxProperties) {
  // Можно добавить цветовую логику по variant
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography variant="body2" color="text.main">
        {label}
      </Typography>
      <Typography
        variant="h5"
        color={variant === 'primary' ? 'primary.main' : 'text.primary'}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default KPIBox;
