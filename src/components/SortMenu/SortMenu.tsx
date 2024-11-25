import React, { useState } from 'react';
import {
  Button,
  Grid2 as Grid,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

type SortOption = {
  label: string;
  value: string;
};

type SortMenuProperties = {
  label: string;
  onSortChange: (option: string) => void;
  currentSort: string;
  sortOptions: SortOption[];
};

function SortMenu({
  label,
  onSortChange,
  currentSort,
  sortOptions,
}: SortMenuProperties) {
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  const handleSortChange = (option: string) => {
    onSortChange(option);
    handleClose();
  };

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === currentSort)?.label || 'Sort';

  return (
    <Grid container>
      <Button
        aria-controls="sort-menu"
        aria-haspopup="true"
        onClick={handleClick}
        endIcon={anchorElement ? <ArrowDropUp /> : <ArrowDropDown />}
      >
        <Typography
          variant="body2"
          width={{ xs: 84, sm: 160 }}
          sx={{ wordWrap: 'break-word' }}
        >
          {label}: {currentSortLabel}
        </Typography>
      </Button>

      <Menu
        id="sort-menu"
        anchorEl={anchorElement}
        keepMounted
        open={Boolean(anchorElement)}
        onClose={handleClose}
      >
        {sortOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === currentSort}
            onClick={() => handleSortChange(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Grid>
  );
}

export default SortMenu;
