import React from 'react';
import { Box, Typography } from '@mui/material';
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          pb: 2,
          gap: 2,
          overflow: 'hidden',
        }}
      >
        {/* Filters Section - Vertical Layout */}
        {filters && filters.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filters.map((filter) => (
              <Box key={filter.key}>{filter}</Box>
            ))}
          </Box>
        )}

        {/* Sorting Section - Vertical Layout, pinned to bottom right */}
        {sorting && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              justifyContent: 'flex-end',
              marginLeft: 'auto',
            }}
          >
            {sorting}
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box>{content}</Box>
    </Box>
  );
}

export default PageLayout;
