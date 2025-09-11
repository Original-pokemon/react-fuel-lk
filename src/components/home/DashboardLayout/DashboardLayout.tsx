import React from 'react';
import { Box, Grid2 as Grid } from '@mui/material';

type DashboardLayoutProperties = {
  children: React.ReactNode;
};

function DashboardLayout({ children }: DashboardLayoutProperties) {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {children}
      </Grid>
    </Box>
  );
}

export default DashboardLayout;
