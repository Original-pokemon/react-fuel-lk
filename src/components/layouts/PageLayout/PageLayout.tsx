import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AlertBanner from "#root/components/AlertBanner/AlertBanner";

type SubComponentProperties = {
  children: React.ReactNode;
};

function Breadcrumbs({ children }: SubComponentProperties) {
  return <Box sx={{ mb: 2 }}>{children}</Box>;
}

function Title({ children }: SubComponentProperties) {
  return (
    <Typography variant="h5" sx={{ mb: 2 }}>
      {children}
    </Typography>
  );
}

function Diagrams({ children }: SubComponentProperties) {
  return <Box sx={{ mb: 2 }}>{children}</Box>;
}

function Content({ children }: SubComponentProperties) {
  return <Box>{children}</Box>;
}

function Filters({ children }: SubComponentProperties) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {React.Children.map(children, (child) => (
        <Box>{child}</Box>
      ))}
    </Box>
  );
}

function Sorting({ children }: SubComponentProperties) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        justifyContent: "flex-end",
        ml: "auto",
      }}
    >
      {children}
    </Box>
  );
}

function Toolbar({ children }: SubComponentProperties) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        pb: 2,
        gap: 2,
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
}

function BackButton({ fallback = "/" }: { fallback?: string }) {
  const navigate = useNavigate();

  const handleBack = () => {
    const canGoBack = (window.history.state?.idx as number) > 0;

    if (canGoBack) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={handleBack}
      startIcon={<ChevronLeft />}
      sx={{ width: "fit-content" }}
    >
      Назад
    </Button>
  );
}

type PageLayoutProperties = {
  children: React.ReactNode;
};

function PageLayout({ children }: PageLayoutProperties) {
  return (
    <Box sx={{ p: 2 }}>
      <AlertBanner />
      {children}
    </Box>
  );
}

PageLayout.Breadcrumbs = Breadcrumbs;
PageLayout.Title = Title;
PageLayout.Diagrams = Diagrams;
PageLayout.Toolbar = Toolbar;
PageLayout.Filters = Filters;
PageLayout.Sorting = Sorting;
PageLayout.Content = Content;
PageLayout.BackButton = BackButton;

export default PageLayout;
