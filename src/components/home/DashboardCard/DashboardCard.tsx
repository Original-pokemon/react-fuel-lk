import React from 'react';
import { Card, CardHeader, CardContent, Typography, Box } from '@mui/material';

type DashboardCardProperties = {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode; // если нужно добавить кнопки в правой части заголовка
};

function DashboardCard({ title, children, actions }: DashboardCardProperties) {
  return (
    <Card sx={{ height: '100%' }}>
      {title && (
        <CardHeader
          title={
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          }
          action={actions}
        />
      )}
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}

export default DashboardCard;
