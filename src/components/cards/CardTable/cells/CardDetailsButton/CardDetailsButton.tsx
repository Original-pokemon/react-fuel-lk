import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useState, MouseEvent } from "react";
import AppRoute from "#root/const/app-route";

type CardDetailsButtonProperties = {
  cardnum: number;
  iconSize?: number | string;
};

function CardDetailsButton({
  cardnum,
  iconSize = 24,
}: CardDetailsButtonProperties) {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>();
  const open = Boolean(anchorElement);
  const [, setSearchParameters] = useSearchParams();
  const navigate = useNavigate();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  const handleViewDetails = () => {
    setSearchParameters({ modalcardnum: cardnum.toString() });
    handleClose();
  };

  const handleViewTransactions = () => {
    const searchParameters = createSearchParams({
      filterbycard: cardnum.toString(),
    });
    navigate(`${AppRoute.Transaction}?${searchParameters.toString()}`);
    // setSearchParams({ filterbycard: cardnum.toString() })
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon sx={{ fontSize: iconSize }} />
      </IconButton>
      <Menu anchorEl={anchorElement} open={open} onClose={handleClose}>
        <MenuItem onClick={handleViewDetails}>
          <VisibilityIcon sx={{ mr: 1 }} />
          <Typography variant="body2">Посмотреть детали</Typography>
        </MenuItem>
        <MenuItem onClick={handleViewTransactions}>
          <ReceiptIcon sx={{ mr: 1 }} />
          <Typography variant="body2">Просмотреть транзакции</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}

CardDetailsButton.defaultProps = {
  iconSize: undefined,
};

export default CardDetailsButton;
