import React from 'react';
import { Box, Grid2 as Grid, Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/system';

type PageLayoutProperties = {
  title: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  diagrams?: React.ReactNode;
  filters?: React.ReactElement[];
  sorting?: React.ReactNode;
  content: React.ReactNode;
  sx?: SxProps<Theme>;
};

function PageLayout({
  title,
  breadcrumbs,
  diagrams,
  filters,
  sorting,
  content,
  sx,
}: PageLayoutProperties) {
  return (
    <Box sx={{ p: 2, ...sx }}>
      {/* Breadcrumbs */}
      {breadcrumbs && <Box mb={2}>{breadcrumbs}</Box>}

      {/* Title */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        {title}
      </Typography>

      {/* Diagrams */}
      {diagrams && <Box mb={2}>{diagrams}</Box>}

      {/* Filters and Sorting */}
      <Grid container pb={2} spacing={2}>
        {/* Filters Section - Vertical Layout */}
        {filters && filters.length > 0 && (
          <Grid size="auto">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filters.map((filter) => (
                <Box key={filter.key}>{filter}</Box>
              ))}
            </Box>
          </Grid>
        )}

        {/* Sorting Section - Vertical Layout */}
        {sorting && (
          <Grid
            size="auto"
            offset="auto"
            sx={{ display: 'flex', alignItems: 'flex-end' }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {sorting}
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Content */}
      <Box>{content}</Box>
    </Box>
  );
}

export default PageLayout;
